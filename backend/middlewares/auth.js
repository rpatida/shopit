const User = require('../models/user');
//check if user is authenticated or not
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');

exports.isAuthunticatedUser = catchAsyncErrors( async(req, res, next)=>{
    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler('Login first to access this resource.',401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id)
    next()
})

//Handling roles for user accounts
exports.authorizeRole = (...roles) => {
    return (req, res, next)=> {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Roles (${req.user.role}) is not allowed to access`, 403))
        }
        next()
    }
}