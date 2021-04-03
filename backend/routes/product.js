const express = require('express');
const router = express.Router();


const { getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReviews,
    getAdminProducts } = require('../controllers/productController');

const { isAuthunticatedUser, authorizeRole } = require('../middlewares/auth');


router.route('/products').get(getProducts);
router.route('/admin/products').get(getAdminProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthunticatedUser, authorizeRole('admin'), newProduct);
router.route('/admin/product/:id')
    .put(isAuthunticatedUser, authorizeRole('admin'), updateProduct)
    .delete(isAuthunticatedUser, authorizeRole('admin'), deleteProduct);


router.route('/review').put(isAuthunticatedUser, createProductReview);
router.route('/reviews').get(isAuthunticatedUser, getProductReviews)
router.route('/reviews').delete(isAuthunticatedUser, deleteReviews)

module.exports = router;