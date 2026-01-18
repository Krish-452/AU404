const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 45000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected with connection pooling');
  } catch (err) {
    console.warn('Local MongoDB connection failed. Falling back to In-Memory Database...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`MongoDB Connected (In-Memory) at ${uri}`);
    } catch (memError) {
      console.error('Fatal: Could not connect to any MongoDB.', memError);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
