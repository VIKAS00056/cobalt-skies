import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, default: '' },
  usn: { type: String, default: '' },
});

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemType: {
      type: String,
      enum: ['Event', 'Game'],
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
    itemTitle: {
      type: String,
      required: true,
    },
    isTeam: {
      type: Boolean,
      default: false,
    },
    teamName: {
      type: String,
      default: '',
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: [],
    },
    // Primary participant details
    participantName: {
      type: String,
      required: true,
    },
    participantEmail: {
      type: String,
      required: true,
    },
    participantPhone: {
      type: String,
      required: true,
    },
    participantCollege: {
      type: String,
      required: true,
    },
    participantUsn: {
      type: String,
      default: '',
    },
    totalFee: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    registrationStatus: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED', 'PENDING'],
      default: 'PENDING',
    },
    qrCodeData: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help prevent accidental duplicate registrations by same user for same active item
registrationSchema.index({ user: 1, event: 1, game: 1 });

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
