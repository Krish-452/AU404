import mongoose, { Document, Schema } from 'mongoose';

export interface IRequest extends Document {
    companyId: mongoose.Types.ObjectId;
    citizenId: mongoose.Types.ObjectId;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    dataScope: string[];
    reviewedAt?: Date;
}

const requestSchema = new Schema<IRequest>({
    companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    citizenId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    dataScope: { type: [String], required: true },
    reviewedAt: { type: Date }
}, { timestamps: true });

export const AccessRequest = mongoose.model<IRequest>('AccessRequest', requestSchema);
