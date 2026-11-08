import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
    },
    itemType: {
      type: String,
      enum: ['Event', 'Game'],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['CREATED', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'CREATED',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'CARD', 'NETBANKING', 'WALLET', 'SIMULATED_TEST', 'OTHER'],
      default: 'UPI',
    },
    failureReason: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
    webhookPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
