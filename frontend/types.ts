
export enum UserRole {
  CITIZEN = 'CITIZEN',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  EXPIRED = 'EXPIRED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface IdentityAttribute {
  id: string;
  key: string;
  label: string;
  value: string;
  category: 'Personal' | 'Health' | 'Agriculture' | 'City';
  lastUpdated: string;
  isSensitive: boolean;
}

export interface AccessRequest {
  id: string;
  requesterName: string;
  requesterType: 'Healthcare' | 'Agriculture' | 'Urban' | 'Finance';
  purpose: string;
  attributesRequested: string[];
  durationDays: number;
  status: RequestStatus;
  timestamp: string;
  riskScore?: number;
  aiAnalysis?: string;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  entity: string;
  action: string;
  details: string;
  ipAddress: string;
}
