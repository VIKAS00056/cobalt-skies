import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('your_key_id')) {
    // Return null or mock instance flag so controllers know to use development simulation if keys not provided
    return null;
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });
  }

  return razorpayInstance;
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId 
 * @param {string} paymentId 
 * @param {string} signature 
 * @returns {boolean}
 */
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${orderId}|${paymentId}`);
  const expectedSignature = hmac.digest('hex');

  return expectedSignature === signature;
};

/**
 * Verify Razorpay webhook signature
 * @param {string} rawBody 
 * @param {string} signature 
 * @returns {boolean}
 */
export const verifyWebhookSignature = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const expectedSignature = hmac.digest('hex');

  return expectedSignature === signature;
};
