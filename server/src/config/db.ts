import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', false);
        
        await mongoose.connect('mongodb+srv://sumantshah_db_user:yvMflgcreZIlTU7l@cluster0.zzf8zov.mongodb.net/fingerprint');
        console.log('✅ Connected successfully to MongoDB');
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
};

export default connectDB;