import crypto from 'crypto';

/**
 * Generate formatted Registration ID
 * @param {'Event' | 'Game'} type 
 * @returns {string} E.g., CS26-EVT-8921 or CS26-GAM-4091
 */
export const generateRegistrationId = (type) => {
  const prefix = type === 'Event' ? 'CS26-EVT' : 'CS26-GAM';
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomDigits}`;
};

/**
 * Generate formatted Payment Reference ID
 * @returns {string} E.g., PAY-CS-918274
 */
export const generatePaymentId = () => {
  const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `PAY-CS-${Date.now().toString().slice(-4)}${randomHex}`;
};

/**
 * Generate QR Verification string payload for gate pass
 * @param {object} reg 
 * @returns {string}
 */
export const generateQrPayload = (reg) => {
  return JSON.stringify({
    regId: reg.registrationId,
    item: reg.itemTitle,
    lead: reg.participantName,
    team: reg.teamName || 'Solo',
    status: reg.paymentStatus,
    timestamp: new Date().toISOString(),
  });
};
