import User from '../models/User.js';
import Event from '../models/Event.js';
import Game from '../models/Game.js';
import Registration from '../models/Registration.js';
import Payment from '../models/Payment.js';

/**
 * @desc    Get dashboard summary statistics & analytics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalEvents = await Event.countDocuments();
    const totalGames = await Game.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Successful payments count and total revenue
    const successfulPayments = await Payment.find({ status: 'SUCCESS' });
    const pendingPaymentsCount = await Payment.countDocuments({ status: 'CREATED' });
    const failedPaymentsCount = await Payment.countDocuments({ status: 'FAILED' });

    const totalRevenue = successfulPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Event registrations vs Game registrations
    const eventRegsCount = await Registration.countDocuments({ itemType: 'Event' });
    const gameRegsCount = await Registration.countDocuments({ itemType: 'Game' });

    // Recent 8 registrations
    const recentRegistrations = await Registration.find()
      .populate('user', 'name email college phone')
      .sort({ createdAt: -1 })
      .limit(8);

    // Item-wise revenue breakdown
    const itemRevenueAggregation = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      {
        $group: {
          _id: { itemType: '$itemType', title: '$itemTitle' },
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalGames,
        totalRegistrations,
        successfulPaymentsCount: successfulPayments.length,
        pendingPaymentsCount,
        failedPaymentsCount,
        totalRevenue,
        eventRegsCount,
        gameRegsCount,
        recentRegistrations,
        topRevenueItems: itemRevenueAggregation.map((item) => ({
          title: item._id.title,
          type: item._id.itemType,
          revenue: item.totalRevenue,
          ticketsSold: item.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with search & filters
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle block/unblock user
 * @route   PATCH /api/admin/users/:id/toggle-block
 * @access  Private/Admin
 */
export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot block administrator accounts' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User has been ${user.isBlocked ? 'suspended' : 'reactivated'} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all payment ledger records (Admin)
 * @route   GET /api/admin/payments
 * @access  Private/Admin
 */
export const getAllPayments = async (req, res, next) => {
  try {
    const { status, itemType, search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (itemType && itemType !== 'All') {
      query.itemType = itemType;
    }

    if (search) {
      query.$or = [
        { paymentId: { $regex: search, $options: 'i' } },
        { razorpayOrderId: { $regex: search, $options: 'i' } },
        { razorpayPaymentId: { $regex: search, $options: 'i' } },
        { itemTitle: { $regex: search, $options: 'i' } },
      ];
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email phone college')
      .populate('registration', 'registrationId teamName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export Registrations as CSV
 * @route   GET /api/admin/export/registrations
 * @access  Private/Admin
 */
export const exportRegistrationsCSV = async (req, res, next) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email phone college usn')
      .sort({ createdAt: -1 });

    const headers = [
      'Registration ID',
      'Item Type',
      'Item Name',
      'Lead Name',
      'Lead Email',
      'Lead Phone',
      'Lead College',
      'Lead USN',
      'Team Name',
      'Team Members Count',
      'Fee (INR)',
      'Payment Status',
      'Registration Status',
      'Date Registered',
    ];

    const rows = registrations.map((r) => [
      `"${r.registrationId}"`,
      `"${r.itemType}"`,
      `"${r.itemTitle.replace(/"/g, '""')}"`,
      `"${r.participantName.replace(/"/g, '""')}"`,
      `"${r.participantEmail}"`,
      `"${r.participantPhone}"`,
      `"${(r.participantCollege || '').replace(/"/g, '""')}"`,
      `"${r.participantUsn || ''}"`,
      `"${(r.teamName || 'Solo').replace(/"/g, '""')}"`,
      r.teamMembers ? r.teamMembers.length + 1 : 1,
      r.totalFee,
      `"${r.paymentStatus}"`,
      `"${r.registrationStatus}"`,
      `"${r.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment(`Cobalt_Skies_Registrations_${Date.now()}.csv`);
    return res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export Payments as CSV
 * @route   GET /api/admin/export/payments
 * @access  Private/Admin
 */
export const exportPaymentsCSV = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email phone college')
      .sort({ createdAt: -1 });

    const headers = [
      'Payment ID',
      'Razorpay Order ID',
      'Razorpay Payment ID',
      'User Name',
      'User Email',
      'Item Type',
      'Item Title',
      'Amount (INR)',
      'Status',
      'Payment Method',
      'Transaction Date',
    ];

    const rows = payments.map((p) => [
      `"${p.paymentId}"`,
      `"${p.razorpayOrderId}"`,
      `"${p.razorpayPaymentId || 'N/A'}"`,
      `"${(p.user?.name || 'N/A').replace(/"/g, '""')}"`,
      `"${p.user?.email || 'N/A'}"`,
      `"${p.itemType}"`,
      `"${(p.itemTitle || '').replace(/"/g, '""')}"`,
      p.amount,
      `"${p.status}"`,
      `"${p.paymentMethod}"`,
      `"${p.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment(`Cobalt_Skies_Payments_${Date.now()}.csv`);
    return res.send(csvContent);
  } catch (error) {
    next(error);
  }
};
