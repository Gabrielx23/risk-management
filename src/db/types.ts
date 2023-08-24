import type { ColumnType } from 'kysely';

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Otp {
  id: string;
  otp: string;
  userId: string;
  purpose: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

export interface Problems {
  id: string;
  title: string;
  description: string | null;
  result: number | null;
  createdAt: Timestamp;
  solvedAt: Timestamp | null;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface RefreshTokens {
  token: string;
  userId: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

export interface RiskMetrics {
  id: string;
  likelihood: number;
  impact: number;
  comment: string;
  problemId: string;
  createdAt: Timestamp;
  createdBy: string;
}

export interface Users {
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserSettings {
  userId: string;
  name: string;
  value: string;
}

export interface DB {
  otp: Otp;
  problems: Problems;
  refreshTokens: RefreshTokens;
  riskMetrics: RiskMetrics;
  users: Users;
  userSettings: UserSettings;
}
