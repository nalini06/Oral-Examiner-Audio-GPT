const mongoose  = require('mongoose');
const dotenv  = require('dotenv');
dotenv.config();
const mongo_uri =  process.env.TEST_MONGO_URI;

exports.dbConnection = async () => {
    try {
        const connection = await mongoose.connect(mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Succesful connection to the database ->  ${connection.connection.host}`);
    } catch (error) {
        console.log('Database connection failed', error.message);
    }
};


