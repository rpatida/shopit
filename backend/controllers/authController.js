const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const cloudinary = require('cloudinary');
const crypto = require('crypto');

//Register new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res);
});

//login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;


    //check email and password enter by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email or Password', 400));
    }

    //Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid email or Password', 400));
    }

    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Password', 400));
    }

    sendToken(user, 200, res);
});

//forgot password => api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found in this email', 400));
    }

    //Get reset token
    const resetToken = user.getResetPassword();

    await user.save({ validateBeforeSave: false })

    //create reset url
    const restUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${restUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
        await sendEmail({
            email: req.body.email,
            subject: 'ShopIT password recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message), 500)
    }
})


//reset password => api/v1/password/reset
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Has URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken
        // resetPasswordExpires : { $lt : Date.now()}
    })

    if (!user) {
        return next(new ErrorHandler('Token is invalid or has been expored', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password doesnot match', 400))
    }

    //setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    sendToken(user, 200, res)


})

// get currently logged in user details =>/api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// update password =>/api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isMatched = await user.comparePassword(req.body.oldPassword);

    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)


    res.status(200).json({
        success: true,
        user
    })
})

//update user profile => /api/v1/updateProfile.
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  
    let avatar = req.body.avatar;


    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //TODO : update Avatar
    if (avatar != '') {
       
        const user = await User.findById(req.user._id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id)

        const result = await cloudinary.v2.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }

    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

//get All users
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        user
    })
})

//get user details => /api/v1/admin/user:id 
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler('User is not exist', 400))
    }
    res.status(200).json({
        success: true,
        user
    })
})

//loggedout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User logged out succefully'
    })
})

//update user profile => /api/v1/admin/user:id.
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    //TODO : update Avatar

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

//delete user => /api/v1/admin/delete/:id 
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler('User is not exist', 400))
    }

    //TODO : remove avatar from cloudinary

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    })
})
