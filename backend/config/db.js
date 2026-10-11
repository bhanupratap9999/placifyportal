const mongoose = require('mongoose');

let dbConnection = { connected: false, usesMock: false };
let mongoServer = null;

const connectDB = async () => {
    const production = process.env.NODE_ENV === 'production';
    if (production && !process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is required in production');
    }

    try {
        // Attempt to connect using the configured MONGODB_URI
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        dbConnection = { connected: true, usesMock: false };
        return true;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        if (production) {
            throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error });
        }
        
        // Dynamic fallback to mongodb-memory-server
        try {
            console.log('🔄 Attempting to start in-memory MongoDB server fallback...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            console.log(`ℹ️ In-memory MongoDB Server started at: ${memoryUri}`);
            
            await mongoose.connect(memoryUri);
            console.log(`✅ MongoDB Connected to In-Memory Database`);
            dbConnection = { connected: true, usesMock: false };
            return true;
        } catch (fallbackError) {
            console.warn('⚠️ Could not start/connect to mongodb-memory-server:', fallbackError.message);
            console.warn('⚠️ Falling back to simple in-memory mock database (some features will be disabled)');
            console.warn('ℹ️ To use real MongoDB, set a working MONGODB_URI in your .env file');
            
            dbConnection = { connected: false, usesMock: true };
            return false;
        }
    }
};

const getDB = () => {
    if (dbConnection.usesMock) {
        try {
            const mockDb = require('../models/mockDb');
            return mockDb;
        } catch (err) {
            console.error('Error loading mock database:', err.message);
        }
    }
    return null;
};

const isUsingMockDB = () => dbConnection.usesMock;

module.exports = { connectDB, getDB, isUsingMockDB };
