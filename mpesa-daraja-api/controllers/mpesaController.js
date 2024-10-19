const axios = require('axios');
const Payment = require('../models/payment');
const { generateToken, getTimestamp, generatePassword } = require('../utils/mpesaUtils');

// Initiate STK Push
exports.initiateSTKPush = async (req, res) => {
    const { phoneNumber, amount } = req.body;

    try {
        const token = await generateToken();  // Generate access token
        const timestamp = getTimestamp();     // Get current timestamp
        const password = generatePassword(timestamp);  // Generate password

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.DARAJA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: process.env.DARAJA_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: process.env.CALLBACK_URL,
                AccountReference: 'EcommercePayment',
                TransactionDesc: 'Payment for order',
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const payment = new Payment({ phoneNumber, amount });
        await payment.save();  // Save payment record to the database

        res.status(200).json({ success: true, message: 'STK push initiated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'STK push failed' });
    }
};

// Handle M-Pesa callback
exports.handleCallback = async (req, res) => {
    const { Body } = req.body;

    const resultCode = Body.stkCallback.ResultCode;
    const transactionId = Body.stkCallback.CallbackMetadata?.Item[1]?.Value;

    if (resultCode === 0) {
        const payment = await Payment.findOneAndUpdate(
            { transactionId },
            { status: 'Completed' },
            { new: true }
        );
        console.log('Payment successful:', payment);
    } else {
        console.log('Payment failed');
    }

    res.sendStatus(200);
};