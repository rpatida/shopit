const Order = require('../models/order');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');


// create new order => api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })

})


// get single order => api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('order not fount', 400))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// get my order => api/v1/order/me
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return new ErrorHandler('order not fount', 400)
    }

    await order.remove();

    res.status(200).json({
        success: true
    })
})

// delet order => api/v1/admin/order/:id
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
    if (!orders) {
        return new ErrorHandler('order not fount', 400)
    }

    res.status(200).json({
        success: true,
        orders
    })
})

// get all order => api/v1/admin/orders
exports.getAllOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.paymentInfo.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// update/process order => api/v1/admin/order/:id
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.paymentInfo.orderStatus === 'Delivered') {
        return next(new ErrorHandler('order not fount', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,

        await order.save();

    res.status(200).json({
        success: true
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    console.log(id, product)
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}