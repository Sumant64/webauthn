import mongoose, { Schema, Document } from 'mongoose';

interface ICredentials {
    id?: Buffer;
    publicKey?: Buffer;
    counter?: number;
    deviceType?: string;
    backedUp?: boolean;
    transport?: string[];
}

interface IUser extends Document {
    name: string;
    phone: number;
    email: string;
    userId: string;
    credentials: ICredentials;
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        minlength: 10,
    },
    email: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    credentials: {
        type: Object,
    },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
