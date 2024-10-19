## M-Pesa Payment Integration with Daraja API

This project is a simple REST API service built with Node.js, Express, and MongoDB that integrates Safaricom's Daraja API to enable M-Pesa payments for an e-commerce application. The API uses the Express STK push method to prompt customers to authenticate the payment request by entering their M-Pesa PIN.


### Technologies Used
 * Node.js: JavaScript runtime environment.
 * Express.js: Fast, unopinionated, minimalist web framework for Node.js.
 * MongoDB: NoSQL database for storing payment records.
 * Mongoose: MongoDB object modeling tool.
 * Axios: Promise-based HTTP client to interact with Daraja API.
 * Daraja API: Safaricom's API for M-Pesa integration.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

 * Node.js (v12.x or higher)
 * MongoDB (You can use MongoDB Atlas for a cloud-based DB)
 * Postman (for API testing)
 * Safaricom's Daraja API credentials
 * Safaricom Daraja API Sandbox Details
  
You will need to create a developer account and access sandbox credentials from the Daraja Developer Portal.

### Getting Started
1. Clone the repository

        git clone https://github.com/your-username/NodeJs-Daraja-API
        cd NodeJs-Daraja-API/mpesa-daraja-api

2. Install dependencies

        npm install

3. Set up MongoDB
If using MongoDB locally, ensure you have MongoDB running.
If using MongoDB Atlas, set up your connection string and replace it in the .env file.

4. Set up environment variables:
Create a .env file in the root directory and add the following environment variables;

        PORT=5000
        MONGODB_URI=mongodb://localhost:27017/mpesa-payments
        CONSUMER_KEY=your_daraja_consumer_key
        CONSUMER_SECRET=your_daraja_consumer_secret
        SHORTCODE=your_mpesa_shortcode
        PASSKEY=your_safaricom_passkey
        PARTYB=your_mpesa_shortcode
        CALLBACK_URL=http://localhost:5000/api/v1/mpesa/callback
Make sure you replace CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE and PASSKEY with your own Daraja API sandbox/production credentials.

5. Run the application:

        npm start
The server will start on http://localhost:5000.

### Folder Structure

        .
        ├── controllers
        │   └── mpesaController.js    # Handles M-Pesa STK Push and callbacks
        ├── models
        │   └── Payment.js            # MongoDB model for storing payments
        ├── routes
        │   └── mpesa.js              # API routes for M-Pesa integration
        ├── .env                      # Environment variables
        ├── app.js                    # Main application file
        ├── package.json              # Node.js project configuration
        └── README.md                 # This file

### Environment Variables
Make sure you create a .env file with the following variables:

 * CONSUMER_KEY: Your Daraja API consumer key.
 * CONSUMER_SECRET: Your Daraja API consumer secret.
 * SHORTCODE: The M-Pesa short code (e.g., 174379 for sandbox).
 * PASSKEY: The Lipa Na M-Pesa Online passkey.
 * CALLBACK_URL: Your server's callback URL that Safaricom will send payment status updates to.
 * MONGODB_URI: MongoDB connection URI.
  
### API Endpoints
1. Initiate STK Push
* Endpoint: POST /api/v1/mpesa/stkpush

* Description: Initiates an M-Pesa STK push request to the user's phone.

Request Body (JSON):

        {
        "phoneNumber": "254712345678",
        "amount": 1
        }
* phoneNumber: Customer's phone number in the format 2547XXXXXXXX.
* amount: Amount to be charged in KES.
  
Response (JSON):


        {
        "success": true,
        "message": "STK push initiated"
        }

2. M-Pesa Callback
* Endpoint: POST /api/v1/mpesa/callback

* Description: Safaricom sends payment status updates to this endpoint after a customer approves the STK push on their phone.

Callback Payload Example (from Safaricom):


        {
        "Body": {
            "stkCallback": {
            "MerchantRequestID": "174379-12345678-1",
            "CheckoutRequestID": "ws_CO_12345678901234567890123456",
            "ResultCode": 0,
            "ResultDesc": "The service request is processed successfully.",
            "CallbackMetadata": {
                "Item": [
                {
                    "Name": "Amount",
                    "Value": 1
                },
                {
                    "Name": "MpesaReceiptNumber",
                    "Value": "NLJ7RT61SV"
                },
                {
                    "Name": "PhoneNumber",
                    "Value": 254712345678
                }
                ]
            }
            }
        }
        }

### Testing with Postman
1. STK Push Request:

 * Method: POST

 * URL: http://localhost:5000/api/v1/mpesa/stkpush

Body (JSON):


        {
        "phoneNumber": "254712345678",
        "amount": 1
        }

2. Simulating M-Pesa Callback:

 * Method: POST

 * URL: http://localhost:5000/api/v1/mpesa/callback

Body (JSON):


        {
        "Body": {
            "stkCallback": {
            "MerchantRequestID": "174379-12345678-1",
            "CheckoutRequestID": "ws_CO_12345678901234567890123456",
            "ResultCode": 0,
            "ResultDesc": "The service request is processed successfully.",
            "CallbackMetadata": {
                "Item": [
                { "Name": "Amount", "Value": 1 },
                { "Name": "MpesaReceiptNumber", "Value": "NLJ7RT61SV" },
                { "Name": "PhoneNumber", "Value": 254712345678 }
                ]
            }
            }
        }
        }

### Database Schema
The Payment schema is defined as follows:


        {
        phoneNumber: { type: String, required: true },
        amount: { type: Number, required: true },
        transactionId: { type: String, required: false },
        status: { type: String, default: 'Pending' },
        createdAt: { type: Date, default: Date.now }
        }
