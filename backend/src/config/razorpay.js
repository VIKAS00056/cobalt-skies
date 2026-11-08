import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

/**
 * Returns Razorpay instance if configured, or null for demo/test mode.
 * Note: Live payments are explicitly disabled. The application operates in
 * zero-cost demo/test mode with authentic server-side simulated UPI verification.
 */
export const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  // Enforce demo/test mode: live payments are disabled
  if (
    process.env.RAZORPAY_TEST_MODE !== 'false' ||
    !key_id ||
    !key_secret ||
    key_id.includes('your_key_id') ||
    key_id.includes('DEMO')
  ) {
    return null;
  }

  // Only allow test keys (starting with rzp_test_)
  if (!key_id.startsWith('rzp_test_')) {
    console.warn('Live Razorpay keys are prohibited in this deployment. Falling back to test mode.');
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
