import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', false);
        
        await mongoose.connect('mongodb://127.0.0.1:27017/fingerprint');
        console.log('✅ Connected successfully to MongoDB');
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
};

export default connectDB;