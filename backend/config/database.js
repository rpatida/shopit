const mongoose = require('mongoose');


const connectDatabase = () => {
   mongoose.connect(process.env.DB_URI, {
       useNewURLParser : true,
       useUnifiedTopology : true,
       useCreateIndex : true
   }).then(cons => {
       console.log(`MongoDB Database connected with HOST: ${cons.connection.host}`);
   })
};

module.exports = connectDatabase;

