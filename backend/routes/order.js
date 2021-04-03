const express = require('express');
const router = express.Router();

const { newOrder,
    getSingleOrder,
    myOrders,
    getAllOrder,
    updateOrderStatus,
    deleteOrder } = require('../controllers/orderController')
const { isAuthunticatedUser, authorizeRole } = require('../middlewares/auth')

router.route('/order/new').post(isAuthunticatedUser, newOrder);
router.route('/order/:id').get(isAuthunticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthunticatedUser, myOrders);
router.route('/admin/orders').get(isAuthunticatedUser, authorizeRole('admin'), getAllOrder);
router.route('/admin/order/:id')
.put(isAuthunticatedUser, authorizeRole('admin'), updateOrderStatus)
.delete(isAuthunticatedUser, authorizeRole('admin'), deleteOrder);


module.exports = router