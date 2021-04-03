const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/product');

//setting dovenv file

dotenv.config({path: 'backend/config/config.env'})

connectDatabase();

const seeProducts = async() => {
    try{

        await Product.deleteMany();
        console.log('products are delete')

        await Product.insertMany(products)
        console.log('products are inserted')

        process.exit();

    }catch(error){
        console.log(error.message);
        process.exit();

    }
}

seeProducts();