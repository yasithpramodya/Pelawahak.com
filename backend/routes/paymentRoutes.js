const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const Partner = require('../models/Partner');
const PartnerUnlock = require('../models/PartnerUnlock');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate PayPal Access Token
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal Client ID or Secret is not configured in backend .env file.');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Access Token generation failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Helper to create PayPal Order
async function createPayPalOrder(amount) {
  const baseUrl = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Create Order failed: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

// Helper to capture PayPal Order
async function capturePayPalOrder(orderId) {
  const baseUrl = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal Capture Order failed: ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

// @desc    Create a PayPal order to unlock a partner profile
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { partnerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: 'Invalid partner profile ID format' });
    }

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }

    // Check if already unlocked
    const existingUnlock = await PartnerUnlock.findOne({
      user: req.user._id,
      partner: partnerId,
      status: 'completed'
    });

    if (existingUnlock) {
      return res.status(400).json({ message: 'Profile is already unlocked for this user' });
    }

    // Determine pricing (default $2.99 USD)
    const amount = parseFloat(process.env.UNLOCK_PRICE_USD) || 2.99;

    // Create order on PayPal
    const order = await createPayPalOrder(amount);

    // Save pending unlock record
    await PartnerUnlock.findOneAndUpdate(
      { user: req.user._id, partner: partnerId },
      {
        user: req.user._id,
        partner: partnerId,
        paypalOrderId: order.id,
        amount,
        status: 'pending'
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ orderID: order.id, amount });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ message: error.message || 'Server error creating PayPal order' });
  }
});

// @desc    Capture approved PayPal order and unlock profile
// @route   POST /api/payments/capture-order
// @access  Private
router.post('/capture-order', protect, async (req, res) => {
  try {
    const { orderID, partnerId } = req.body;

    if (!orderID || !partnerId) {
      return res.status(400).json({ message: 'OrderID and partnerId are required' });
    }

    // Capture PayPal payment
    const captureResult = await capturePayPalOrder(orderID);

    // Verify capture status
    const captureStatus = captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.status;
    if (captureResult.status !== 'COMPLETED' && captureStatus !== 'COMPLETED') {
      return res.status(400).json({ 
        message: 'Payment capture was not completed', 
        paypalStatus: captureResult.status 
      });
    }

    // Update PartnerUnlock record in DB
    const unlock = await PartnerUnlock.findOneAndUpdate(
      { user: req.user._id, partner: partnerId },
      {
        status: 'completed',
        paypalOrderId: orderID,
        unlockedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, unlock });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ message: error.message || 'Server error capturing PayPal order' });
  }
});

// @desc    Check unlock status of a partner profile for logged-in user
// @route   GET /api/payments/check/:partnerId
// @access  Private
router.get('/check/:partnerId', protect, async (req, res) => {
  try {
    const { partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: 'Invalid partner profile ID format' });
    }

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: 'Partner profile not found' });
    }

    // Owners and admins don't need to pay
    const isOwner = partner.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (isOwner || isAdmin) {
      return res.json({ unlocked: true, isOwnerOrAdmin: true });
    }

    const unlock = await PartnerUnlock.findOne({
      user: req.user._id,
      partner: partnerId,
      status: 'completed'
    });

    res.json({ unlocked: !!unlock, isOwnerOrAdmin: false });
  } catch (error) {
    console.error('Error checking unlock status:', error);
    res.status(500).json({ message: 'Server error checking unlock status' });
  }
});

// Ad monetisation constants
const AD_SLOT_PRICE = 1.20;
const PLAN_PRICES = {
  basic: 2.99,
  standard: 5.99,
  premium: 9.99
};
const PLAN_ADS = {
  basic: 10,
  standard: 30,
  premium: 999999 // Representing unlimited
};

// @desc    Create a PayPal order to buy a single ad slot
// @route   POST /api/payments/buy-ad-slot
// @access  Private
router.post('/buy-ad-slot', protect, async (req, res) => {
  try {
    const amount = AD_SLOT_PRICE;
    const order = await createPayPalOrder(amount);
    res.status(201).json({ orderID: order.id, amount });
  } catch (error) {
    console.error('Error creating PayPal order for ad slot:', error);
    res.status(500).json({ message: error.message || 'Server error creating PayPal order' });
  }
});

// @desc    Capture approved PayPal order and increment paidAdsRemaining
// @route   POST /api/payments/capture-ad-slot
// @access  Private
router.post('/capture-ad-slot', protect, async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) {
      return res.status(400).json({ message: 'OrderID is required' });
    }

    const captureResult = await capturePayPalOrder(orderID);
    const captureStatus = captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.status;
    if (captureResult.status !== 'COMPLETED' && captureStatus !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment capture was not completed', paypalStatus: captureResult.status });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { paidAdsRemaining: 1 } },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error capturing PayPal order for ad slot:', error);
    res.status(500).json({ message: error.message || 'Server error capturing PayPal order' });
  }
});

// @desc    Create a PayPal order for a subscription plan
// @route   POST /api/payments/subscribe/:plan
// @access  Private
router.post('/subscribe/:plan', protect, async (req, res) => {
  try {
    const { plan } = req.params;
    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const amount = PLAN_PRICES[plan];
    const order = await createPayPalOrder(amount);
    res.status(201).json({ orderID: order.id, amount, plan });
  } catch (error) {
    console.error(`Error creating PayPal order for plan ${req.params.plan}:`, error);
    res.status(500).json({ message: error.message || 'Server error creating PayPal order' });
  }
});

// @desc    Capture approved PayPal order and upgrade subscription
// @route   POST /api/payments/capture-subscription/:plan
// @access  Private
router.post('/capture-subscription/:plan', protect, async (req, res) => {
  try {
    const { plan } = req.params;
    const { orderID } = req.body;
    
    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }
    if (!orderID) {
      return res.status(400).json({ message: 'OrderID is required' });
    }

    const captureResult = await capturePayPalOrder(orderID);
    const captureStatus = captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.status;
    if (captureResult.status !== 'COMPLETED' && captureStatus !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment capture was not completed', paypalStatus: captureResult.status });
    }

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        subscriptionPlan: plan,
        subscriptionEndsAt: oneMonthFromNow,
        freeAdsRemaining: PLAN_ADS[plan] // Reset their quota based on plan
      },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(`Error capturing PayPal order for plan ${req.params.plan}:`, error);
    res.status(500).json({ message: error.message || 'Server error capturing PayPal order' });
  }
});

module.exports = router;
