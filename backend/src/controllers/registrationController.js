import Registration from '../models/Registration.js';
import Payment from '../models/Payment.js';
import Event from '../models/Event.js';
import Game from '../models/Game.js';

/**
 * @desc    Get current logged in user's registrations
 * @route   GET /api/registrations/my-registrations
 * @access  Private
 */
export const getMyRegistrations = async (req, res, next) => {
  try {
    const { type } = req.query; // 'Event' | 'Game' | undefined
    const query = { user: req.user._id };

    if (type) {
      query.itemType = type;
    }

    const registrations = await Registration.find(query)
      .populate('event', 'title posterUrl venue date time fee category isTeam')
      .populate('game', 'title posterUrl venue date time fee category platform format isTeam')
      .populate('payment', 'paymentId razorpayPaymentId razorpayOrderId status paymentMethod')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single registration by registrationId or _id
 * @route   GET /api/registrations/:identifier
 * @access  Private
 */
export const getRegistrationById = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let query = {};

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = identifier;
    } else {
      query.registrationId = identifier;
    }

    const registration = await Registration.findOne(query)
      .populate('event')
      .populate('game')
      .populate('payment')
      .populate('user', 'name email phone college usn');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration pass not found',
      });
    }

    // Check authorization: User can only see their own pass unless admin
    if (
      req.user.role !== 'admin' &&
      registration.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view your own registration details',
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Get all registrations with filtering and search
 * @route   GET /api/registrations
 * @access  Private/Admin
 */
export const getAllRegistrations = async (req, res, next) => {
  try {
    const { search, itemType, paymentStatus, registrationStatus } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { registrationId: { $regex: search, $options: 'i' } },
        { participantName: { $regex: search, $options: 'i' } },
        { participantEmail: { $regex: search, $options: 'i' } },
        { participantPhone: { $regex: search, $options: 'i' } },
        { itemTitle: { $regex: search, $options: 'i' } },
        { teamName: { $regex: search, $options: 'i' } },
      ];
    }

    if (itemType && itemType !== 'All') {
      query.itemType = itemType;
    }

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    if (registrationStatus && registrationStatus !== 'All') {
      query.registrationStatus = registrationStatus;
    }

    const registrations = await Registration.find(query)
      .populate('user', 'name email phone college usn')
      .populate('payment', 'paymentId razorpayPaymentId razorpayOrderId status paymentMethod')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin: Cancel a registration
 * @route   PATCH /api/registrations/:id/cancel
 * @access  Private/Admin
 */
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    registration.registrationStatus = 'CANCELLED';
    await registration.save();

    // Decrement counter if previously confirmed
    if (registration.paymentStatus === 'PAID') {
      if (registration.itemType === 'Event' && registration.event) {
        await Event.findByIdAndUpdate(registration.event, {
          $inc: { currentRegistrations: -1 },
        });
      } else if (registration.itemType === 'Game' && registration.game) {
        await Game.findByIdAndUpdate(registration.game, {
          $inc: { currentSlotsFilled: -1 },
        });
      }
    }

    res.json({
      success: true,
      message: 'Registration has been cancelled successfully',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};
