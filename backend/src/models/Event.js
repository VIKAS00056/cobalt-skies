import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: [
        'Technical',
        'Cultural',
        'Literary',
        'Fine Arts',
        'Management',
        'Music & Dance',
        'Workshop',
        'General',
      ],
      default: 'Technical',
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 250,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Detailed event description is required'],
    },
    posterUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    },
    fee: {
      type: Number,
      required: [true, 'Registration fee is required (in INR)'],
      min: [0, 'Fee cannot be negative'],
      default: 0,
    },
    isTeam: {
      type: Boolean,
      default: false,
    },
    minTeamSize: {
      type: Number,
      default: 1,
      min: 1,
    },
    maxTeamSize: {
      type: Number,
      default: 1,
      min: 1,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
    },
    rules: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      default: 'Open to all registered undergraduate and postgraduate college students with valid college ID.',
    },
    prizes: {
      first: { type: String, default: '₹15,000 + Trophy + Certificate' },
      second: { type: String, default: '₹10,000 + Certificate' },
      third: { type: String, default: '₹5,000 + Certificate' },
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      default: 100,
    },
    currentRegistrations: {
      type: Number,
      default: 0,
    },
    coordinators: [
      {
        name: String,
        phone: String,
        role: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Slugify title helper before validation if missing
eventSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
