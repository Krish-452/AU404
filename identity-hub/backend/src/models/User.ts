import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: 'citizen' | 'company' | 'admin';
    name: string;
    mfaSecret?: string;
    mfaEnabled: boolean;
    otpCode?: string;
    otpExpires?: Date;
    domain?: string; // For companies
    createdAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CITIZEN', 'COMPANY', 'ADMIN'], required: true },
    name: { type: String, required: true },
    mfaSecret: { type: String, select: false }, // Protected
    mfaEnabled: { type: Boolean, default: false },
    otpCode: { type: String, select: false }, // New: Store Email OTP
    otpExpires: { type: Date, select: false }, // New: Expiration
    domain: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);
