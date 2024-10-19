const axios = require('axios');
const crypto = require('crypto');

// Generate OAuth Token
exports.generateToken = async () => {
    const credentials = Buffer.from(
        `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${credentials}` } }
    );

    return response.data.access_token;
};

// Get current timestamp
exports.getTimestamp = () => {
    const date = new Date();
    return date
        .toISOString()
        .replace(/[-:TZ.]/g, '')
        .slice(0, 14);
};

// Generate password
exports.generatePassword = (timestamp) => {
    const dataToEncode = `${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`;
    return Buffer.from(dataToEncode).toString('base64');
};