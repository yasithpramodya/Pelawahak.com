// Stripe import removed for mock
import Payment from '../models/Payment.js';
import Unlock from '../models/Unlock.js';
import User from '../models/User.js';

// Setup Mock Stripe (Use real secret in prod)
// const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { type, profileId } = req.body; // type: 'unlock' or 'subscription'
    const userId = req.user._id;

    let amount = type === 'subscription' ? 1000 : 200; // in LKR

    // Mocking Payment Gateway Creation
    const payment = await Payment.create({
      user: userId,
      amount,
      type,
      gateway: 'Stripe', // Using Stripe for Demo Mock
      status: 'success', // Auto success for Mocking
      transactionId: 'mock_tx_' + Date.now()
    });

    if (type === 'subscription') {
      const user = await User.findById(userId);
      user.subscriptionStatus = 'active';
      // Add 30 days
      const d = new Date();
      d.setDate(d.getDate() + 30);
      user.subscriptionEndsAt = d;
      await user.save();
    } else if (type === 'unlock' && profileId) {
      await Unlock.create({
        user: userId,
        profileUnlocked: profileId,
        payment: payment._id,
        type: 'Paid'
      });
    }

    res.status(200).json({ message: 'Payment Mock Successful', payment });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payhereNotify = async (req, res) => {
   // Real PayHere Webhook Verification would go here
   // MD5 Hash verification of merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig
   const { order_id, status_code } = req.body;
   
   if(status_code == 2) {
      // Payment success
      // ... same logic as above to find payment and update user/unlock
   }
   res.status(200).send('OK');
};
