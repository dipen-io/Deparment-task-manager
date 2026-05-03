const mongoose = require("mongoose");

const connectDB = async () => {
    const URL = process.env.MONGO_URI;
    
    if (!URL) {
        console.error('🚨 FATAL: MONGO_URI is not defined');
        process.exit(1);
    }

    const options = {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 50, 
        socketTimeoutMS: 45000, 
        family: 4 
    };

    // 1. Attach listeners BEFORE connecting
    mongoose.connection.on('connected', () => console.log('✅ MongoDB: Connected'));
    mongoose.connection.on('error', (err) => console.error(`❌ MongoDB Runtime Error: ${err.message}`));
    mongoose.connection.on('disconnected', () => console.warn('⚠️ MongoDB: Disconnected'));

    // 2. Initiate the connection
    try {
        await mongoose.connect(URL, options);
    } catch (error) {
        // This catches initial connection failures (e.g., bad password, network down)
        console.error(`❌ Initial Connection Failed: ${error.message}`);
        process.exit(1);        
    }
};

module.exports = connectDB;
