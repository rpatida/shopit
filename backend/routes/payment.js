const express = require('express');
const router = express.Router();

const { isAuthunticatedUser } = require('../middlewares/auth')
const { processPayment, sendStripeApi } = require('../controllers/paymentController')

router.route('/payment/process').post(isAuthunticatedUser, processPayment)
router.route('/stripeapi').get(isAuthunticatedUser, sendStripeApi)

module.exports = router;