import crypto from 'crypto';
import { getRazorpayInstance, verifyRazorpaySignature, verifyWebhookSignature } from '../config/razorpay.js';
import Event from '../models/Event.js';
import Game from '../models/Game.js';
import Registration from '../models/Registration.js';
import Payment from '../models/Payment.js';
import { generateRegistrationId, generatePaymentId, generateQrPayload } from '../utils/generateReceipt.js';

/**
 * @desc    Initiate payment order & pre-create pending registration
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      itemType, // 'Event' | 'Game'
      itemId,
      teamName,
      teamMembers,
      participantPhone,
      participantCollege,
      participantUsn,
    } = req.body;

    const user = req.user;

    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item type (Event or Game) and itemId are required.',
      });
    }

    // 1. Fetch item from database to NEVER trust frontend fee
    let item;
    if (itemType === 'Event') {
      item = await Event.findById(itemId);
    } else if (itemType === 'Game') {
      item = await Game.findById(itemId);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid item type' });
    }

    if (!item) {
      return res.status(404).json({ success: false, message: `${itemType} not found` });
    }

    if (!item.registrationOpen) {
      return res.status(400).json({
        success: false,
        message: `Registrations are currently closed for ${item.title}.`,
      });
    }

    // 2. Prevent duplicate active registrations by the same user
    const existingRegistration = await Registration.findOne({
      user: user._id,
      itemType,
      ...(itemType === 'Event' ? { event: itemId } : { game: itemId }),
      paymentStatus: 'PAID',
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: `You are already registered for ${item.title}! Check your dashboard.`,
      });
    }

    // 3. Backend calculated fee
    const feeInINR = Number(item.fee);
    const amountInPaise = Math.round(feeInINR * 100);

    const registrationId = generateRegistrationId(itemType);
    const internalPaymentId = generatePaymentId();

    let razorpayOrderId;
    const razorpay = getRazorpayInstance();

    if (razorpay) {
      // Create real Razorpay order
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: registrationId,
        notes: {
          itemType,
          itemId: itemId.toString(),
          itemTitle: item.title,
          userId: user._id.toString(),
          userEmail: user.email,
        },
      };

      const order = await razorpay.orders.create(options);
      razorpayOrderId = order.id;
    } else {
      // In development or when keys not set in env:
      // Generate a structured mock Razorpay Order ID to allow test mode flows
      const mockOrderBytes = crypto.randomBytes(8).toString('hex');
      razorpayOrderId = `order_${mockOrderBytes}`;
      console.log(`Razorpay keys not configured. Created development order: ${razorpayOrderId}`);
    }

    // 4. Create pending registration record
    const registration = await Registration.create({
      registrationId,
      user: user._id,
      itemType,
      event: itemType === 'Event' ? item._id : undefined,
      game: itemType === 'Game' ? item._id : undefined,
      itemTitle: item.title,
      isTeam: item.isTeam,
      teamName: teamName || (item.isTeam ? `${user.name}'s Squad` : ''),
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      participantName: user.name,
      participantEmail: user.email,
      participantPhone: participantPhone || user.phone,
      participantCollege: participantCollege || user.college,
      participantUsn: participantUsn || user.usn,
      totalFee: feeInINR,
      paymentStatus: feeInINR === 0 ? 'PAID' : 'PENDING',
      registrationStatus: feeInINR === 0 ? 'CONFIRMED' : 'PENDING',
    });

    // 5. Create payment ledger entry
    const payment = await Payment.create({
      paymentId: internalPaymentId,
      razorpayOrderId,
      user: user._id,
      registration: registration._id,
      itemType,
      itemId: item._id,
      itemTitle: item.title,
      amount: feeInINR,
      currency: 'INR',
      status: feeInINR === 0 ? 'SUCCESS' : 'CREATED',
      paymentMethod: feeInINR === 0 ? 'OTHER' : 'UPI',
      verifiedAt: feeInINR === 0 ? new Date() : null,
    });

    registration.payment = payment._id;
    if (feeInINR === 0) {
      registration.qrCodeData = generateQrPayload(registration);
      // Increment participant count
      if (itemType === 'Event') {
        await Event.findByIdAndUpdate(item._id, { $inc: { currentRegistrations: 1 } });
      } else {
        await Game.findByIdAndUpdate(item._id, { $inc: { currentSlotsFilled: 1 } });
      }
    }
    await registration.save();

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrderId,
        amount: feeInINR === 0 ? 0 : amountInPaise,
        currency: 'INR',
        registrationId: registration.registrationId,
        paymentId: payment.paymentId,
        isFree: feeInINR === 0,
        itemTitle: item.title,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_DEMO_KEY',
        isTestMode: !getRazorpayInstance(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Razorpay payment signature & confirm registration
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
      paymentMethod = 'UPI',
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, Payment ID, and Registration ID are required for verification.',
      });
    }

    const registration = await Registration.findOne({ registrationId }).populate('event game');
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment order record not found',
      });
    }

    // Verify signature
    let isSignatureValid = false;
    const razorpay = getRazorpayInstance();

    if (razorpay) {
      // Real Razorpay secret verification
      isSignatureValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
    } else {
      // In development simulation mode when real keys are not supplied:
      // Verify that this order was created by this server and belongs to the registered user
      if (
        payment.user.toString() === req.user._id.toString() &&
        payment.razorpayOrderId === razorpay_order_id
      ) {
        isSignatureValid = true;
      }
    }

    if (!isSignatureValid) {
      payment.status = 'FAILED';
      payment.failureReason = 'Payment signature verification failed';
      await payment.save();

      registration.paymentStatus = 'FAILED';
      await registration.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature.',
      });
    }

    // Success: Update payment record
    payment.status = 'SUCCESS';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature || 'TEST_SIMULATED_SIGNATURE';
    payment.paymentMethod = paymentMethod;
    payment.verifiedAt = new Date();
    await payment.save();

    // Update registration status
    registration.paymentStatus = 'PAID';
    registration.registrationStatus = 'CONFIRMED';
    registration.qrCodeData = generateQrPayload(registration);
    await registration.save();

    // Increment item registrations
    if (registration.itemType === 'Event' && registration.event) {
      await Event.findByIdAndUpdate(registration.event._id, {
        $inc: { currentRegistrations: 1 },
      });
    } else if (registration.itemType === 'Game' && registration.game) {
      await Game.findByIdAndUpdate(registration.game._id, {
        $inc: { currentSlotsFilled: 1 },
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and registration confirmed!',
      data: {
        registrationId: registration.registrationId,
        itemTitle: registration.itemTitle,
        itemType: registration.itemType,
        totalFee: registration.totalFee,
        paymentStatus: registration.paymentStatus,
        registrationStatus: registration.registrationStatus,
        transactionId: razorpay_payment_id,
        qrCodeData: registration.qrCodeData,
        date: registration.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Razorpay Webhook listener for background reconciliation
 * @route   POST /api/payments/webhook
 * @access  Public (Signature protected)
 */
export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = JSON.stringify(req.body);

    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.warn('Invalid Razorpay webhook signature');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const { event, payload } = req.body;
    console.log(`Received Razorpay webhook event: ${event}`);

    if (event === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      if (payment) {
        payment.status = 'SUCCESS';
        payment.razorpayPaymentId = paymentId;
        payment.webhookPayload = payload;
        payment.verifiedAt = new Date();
        await payment.save();

        const registration = await Registration.findById(payment.registration);
        if (registration) {
          registration.paymentStatus = 'PAID';
          registration.registrationStatus = 'CONFIRMED';
          registration.qrCodeData = generateQrPayload(registration);
          await registration.save();
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      if (payment) {
        payment.status = 'FAILED';
        payment.failureReason = paymentEntity.error_description || 'Payment failed';
        payment.webhookPayload = payload;
        await payment.save();
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's payment transactions history
 * @route   GET /api/payments/my-payments
 * @access  Private
 */
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('registration')
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
