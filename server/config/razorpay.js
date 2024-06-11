const Razorpay = require('razorpay');
require("dotenv").config();

expects.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
})