const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require('cloudinary');

const dotenv = require('dotenv');

//Handle uncaught exceptions
process.on('uncaughtException',err => {
    console.log(`ERRORS: ${err.stack}`);
    console.log('Shuting down the server due to uncaught exception');
    process.exit(1);
})


//setting up config file
dotenv.config({path: 'backend/config/config.env'})


//connecting to connectDatabase
connectDatabase();

//setting up cloudinary server
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY 
  });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT: ${process.env.PORT} in  ${process.env.NODE_ENV}`);
})

//Handle unhandle promise rejection error
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to unhandled Promise rejection');
    server.close(() => {
        process.exit(1);
    });
})

