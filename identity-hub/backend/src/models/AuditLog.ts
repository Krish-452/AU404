import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
    actorId: mongoose.Types.ObjectId;
    actorEmail: string;
    action: string;
    target?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actorEmail: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, immutable: true } // Immutable
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
