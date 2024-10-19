const express = require('express');
const { initiateSTKPush, handleCallback } = require('../controllers/mpesaController');
const router = express.Router();

// Route to initiate STK push
router.post('/stkpush', initiateSTKPush);

// Route to handle callback from Safaricom
router.post('/callback', handleCallback);

module.exports = router;