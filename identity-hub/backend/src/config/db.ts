import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB Connected Successfully (Local)');
    } catch (error) {
        console.warn('Local MongoDB connection failed. Falling back to In-Memory Database for demo...');
        try {
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`MongoDB Connected Successfully (In-Memory at ${uri})`);
        } catch (memError) {
            console.error('Fatal: Could not connect to any MongoDB instance.', memError);
            process.exit(1);
        }
    }
};
