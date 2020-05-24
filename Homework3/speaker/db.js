const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('dotenv').config({ path: './variables.env' });

let isConnected = false;

const connectToDb = async () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return;
    }
 
    console.log('=> using new database connection');
    const db = await mongoose.connect(process.env.DB, {dbName: 'unibg_tedx', useNewUrlParser: true, useUnifiedTopology: true});
    isConnected = db.connections[0].readyState;
};

module.exports = connectToDb;