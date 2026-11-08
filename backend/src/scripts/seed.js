import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Game from '../models/Game.js';
import Registration from '../models/Registration.js';
import Payment from '../models/Payment.js';
import { sampleEvents, sampleGames } from '../utils/seedData.js';
import { generateRegistrationId, generatePaymentId, generateQrPayload } from '../utils/generateReceipt.js';

export const seedDatabase = async () => {
  try {
    console.log('Seeding Cobalt Skies database...');

    // 1. Create or ensure Admin account
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cobaltskies.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword@2026';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Cobalt Skies Lead Admin',
        email: adminEmail,
        password: adminPassword,
        phone: '+91 98765 43210',
        college: 'National Institute of Technology',
        usn: 'ADMIN-01',
        role: 'admin',
      });
      console.log(`Admin account created: ${adminEmail}`);
    } else {
      admin.role = 'admin';
      await admin.save();
      console.log(`Admin account verified: ${adminEmail}`);
    }

    // 2. Create sample demo student participant
    const demoEmail = 'aarav@example.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Aarav Sharma',
        email: demoEmail,
        password: 'Password@123',
        phone: '+91 91234 56789',
        college: "St. Xavier's Institute of Tech",
        usn: '1NX22CS042',
        role: 'user',
      });
      console.log(`Demo participant created: ${demoEmail}`);
    }

    // 3. Seed Events
    const existingEventsCount = await Event.countDocuments();
    let seededEvents = [];
    if (existingEventsCount === 0) {
      seededEvents = await Event.insertMany(sampleEvents);
      console.log(`Successfully seeded ${seededEvents.length} college fest events!`);
    } else {
      seededEvents = await Event.find();
      console.log(`Found ${existingEventsCount} existing events.`);
    }

    // 4. Seed Games
    const existingGamesCount = await Game.countDocuments();
    let seededGames = [];
    if (existingGamesCount === 0) {
      seededGames = await Game.insertMany(sampleGames);
      console.log(`Successfully seeded ${seededGames.length} gaming tournaments!`);
    } else {
      seededGames = await Game.find();
      console.log(`Found ${existingGamesCount} existing games.`);
    }

    // 5. Seed sample completed registrations for demoUser if none exist
    const existingRegCount = await Registration.countDocuments();
    if (existingRegCount === 0 && seededEvents.length > 0 && seededGames.length > 0) {
      // Register for Event 1 (Code Genesis Hackathon)
      const hackathon = seededEvents[0];
      const regId1 = generateRegistrationId('Event');
      const payId1 = generatePaymentId();

      const reg1 = await Registration.create({
        registrationId: regId1,
        user: demoUser._id,
        itemType: 'Event',
        event: hackathon._id,
        itemTitle: hackathon.title,
        isTeam: true,
        teamName: 'CyberTitans',
        teamMembers: [
          { name: 'Ria Sen', email: 'ria@example.com', phone: '+91 98334 11223', college: demoUser.college, usn: '1NX22CS088' },
          { name: 'Kabir Verma', email: 'kabir@example.com', phone: '+91 98445 22334', college: demoUser.college, usn: '1NX22CS054' },
        ],
        participantName: demoUser.name,
        participantEmail: demoUser.email,
        participantPhone: demoUser.phone,
        participantCollege: demoUser.college,
        participantUsn: demoUser.usn,
        totalFee: hackathon.fee,
        paymentStatus: 'PAID',
        registrationStatus: 'CONFIRMED',
      });

      const payment1 = await Payment.create({
        paymentId: payId1,
        razorpayOrderId: `order_seed_demo_${Date.now().toString().slice(-6)}1`,
        razorpayPaymentId: `pay_seed_upi_${Date.now().toString().slice(-6)}1`,
        razorpaySignature: 'SEED_DEMO_SIGNATURE_VERIFIED',
        user: demoUser._id,
        registration: reg1._id,
        itemType: 'Event',
        itemId: hackathon._id,
        itemTitle: hackathon.title,
        amount: hackathon.fee,
        currency: 'INR',
        status: 'SUCCESS',
        paymentMethod: 'UPI',
        verifiedAt: new Date(),
      });

      reg1.payment = payment1._id;
      reg1.qrCodeData = generateQrPayload(reg1);
      await reg1.save();

      // Register for Game 1 (Valorant Championship)
      const valorant = seededGames[0];
      const regId2 = generateRegistrationId('Game');
      const payId2 = generatePaymentId();

      const reg2 = await Registration.create({
        registrationId: regId2,
        user: demoUser._id,
        itemType: 'Game',
        game: valorant._id,
        itemTitle: valorant.title,
        isTeam: true,
        teamName: 'Viper Strike LAN',
        teamMembers: [
          { name: 'Sameer Joshi', email: 'sameer@example.com', phone: '+91 97771 22334', college: demoUser.college, usn: '1NX22IS019' },
          { name: 'Aman Deep', email: 'aman@example.com', phone: '+91 97882 33445', college: demoUser.college, usn: '1NX22EC011' },
          { name: 'Tanvi Roy', email: 'tanvi@example.com', phone: '+91 97993 44556', college: demoUser.college, usn: '1NX22CS095' },
          { name: 'Karthik N', email: 'karthik@example.com', phone: '+91 97114 55667', college: demoUser.college, usn: '1NX22ME004' },
        ],
        participantName: demoUser.name,
        participantEmail: demoUser.email,
        participantPhone: demoUser.phone,
        participantCollege: demoUser.college,
        participantUsn: demoUser.usn,
        totalFee: valorant.fee,
        paymentStatus: 'PAID',
        registrationStatus: 'CONFIRMED',
      });

      const payment2 = await Payment.create({
        paymentId: payId2,
        razorpayOrderId: `order_seed_demo_${Date.now().toString().slice(-6)}2`,
        razorpayPaymentId: `pay_seed_upi_${Date.now().toString().slice(-6)}2`,
        razorpaySignature: 'SEED_DEMO_SIGNATURE_VERIFIED',
        user: demoUser._id,
        registration: reg2._id,
        itemType: 'Game',
        itemId: valorant._id,
        itemTitle: valorant.title,
        amount: valorant.fee,
        currency: 'INR',
        status: 'SUCCESS',
        paymentMethod: 'UPI',
        verifiedAt: new Date(),
      });

      reg2.payment = payment2._id;
      reg2.qrCodeData = generateQrPayload(reg2);
      await reg2.save();

      console.log('Sample verified registrations & UPI payments created for demo user.');
    }

    console.log('Database seeding process completed successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      console.log('Seed script finished. Exiting.');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
