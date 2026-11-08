import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
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
      required: [true, 'Game category is required'],
      enum: [
        'Esports (PC)',
        'Mobile Gaming',
        'Console Battle',
        'Arcade & Carnival',
        'VR Experience',
        'Board & Strategy',
      ],
      default: 'Esports (PC)',
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: 250,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Detailed game description is required'],
    },
    posterUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    },
    fee: {
      type: Number,
      required: [true, 'Entry fee is required (in INR)'],
      min: [0, 'Fee cannot be negative'],
      default: 150,
    },
    isTeam: {
      type: Boolean,
      default: true,
    },
    playersPerTeam: {
      type: Number,
      default: 5,
      min: 1,
    },
    maxSlots: {
      type: Number,
      default: 32,
    },
    currentSlotsFilled: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: [true, 'Game date is required'],
    },
    time: {
      type: String,
      required: [true, 'Game schedule is required'],
    },
    venue: {
      type: String,
      required: [true, 'Gaming arena / venue is required'],
    },
    rules: {
      type: [String],
      default: [],
    },
    platform: {
      type: String,
      default: 'PC / LAN / Mobile',
    },
    format: {
      type: String,
      default: 'Single Elimination Tournament Bracket (Best of 3 Finals)',
    },
    prizes: {
      first: { type: String, default: '₹20,000 + Championship Trophy' },
      second: { type: String, default: '₹10,000 + Runner-up Shield' },
      third: { type: String, default: '₹5,000 + Gaming Goodies' },
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

gameSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Game = mongoose.model('Game', gameSchema);
export default Game;
