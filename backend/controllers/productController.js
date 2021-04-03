const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');


//Create new products => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];
    let imagesLinks = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'product',
            width: 150,
            crop: "scale"
        })
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

//get all products => /api/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 10;
    const productCount = await Product.countDocuments();

    const apiFeature = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    let products = await apiFeature.query;
    let filteredProductCount = products.length;

    apiFeature.pagination(resPerPage)

    products = await apiFeature.query;

    res.status(200).json({
        success: true,
        productCount,
        products,
        filteredProductCount,
        resPerPage
    })
})


//get all admin products => /api/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})


//get single product detail => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not Found', 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})

//update the products => api/v1/product:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not Found', 404))
    }

    let images = [];
    let imagesLinks = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    console.log('images.....', images)

    if (images !== undefined) {

        for (let i = 0; i < product.images.length; i++) {
            const result = cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'product',
                width: 150,
                crop: "scale"
            })
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        product
    })
})

//delete product => /api/v1/admin/product:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not Found', 404))
    }

    for (let i = 0; i < product.images.length; i++) {
        const result = cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    })
})

//Create new review => /api/v1/review/
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    console.log('isReviewed', product);

    const isReviewed = product.reviews.find(
        r => r.user._id.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })

})

//get product review => /api/v1/review
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//get delete product review => /api/v1/review
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length

    const rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})