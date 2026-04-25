/**
 * Type definitions for SOC Dashboard
 */

// Priority levels for field reports
export const Priority = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

// Report status tracking
export const ReportStatus = {
  NEW: 'New',
  REVIEWED: 'Reviewed',
  ACTIONED: 'Actioned',
  CLOSED: 'Closed'
} as const;

export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

// User clearance levels
export const ClearanceLevel = {
  ANALYST: 'ANALYST',        // Can view LOW, MEDIUM reports
  FIELD_COMMANDER: 'FIELD_COMMANDER',  // Can view all, edit status
  ADMIN: 'ADMIN'             // Full access, user management
} as const;

export type ClearanceLevel = typeof ClearanceLevel[keyof typeof ClearanceLevel];

// Field report structure
export interface FieldReport {
  id: string;
  agent: string;
  location: string;
  timestamp: string;
  priority: Priority;
  status: ReportStatus;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  submittedBy: string; // User who submitted
  lastModifiedBy?: string; // User who last updated status
}

// User structure
export interface User {
  id: string;
  username: string;
  passwordHash: string; // Never store plain text passwords
  clearanceLevel: ClearanceLevel;
  fullName: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

// Authentication context
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  canViewReport: (report: FieldReport) => boolean;
  canEditReport: (report: FieldReport) => boolean;
}

// Audit log for security tracking
export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  action: 'LOGIN' | 'LOGOUT' | 'VIEW_REPORT' | 'UPDATE_STATUS' | 'CREATE_REPORT';
  details: string;
  ipAddress?: string;
}

// Filter options for report feed
export interface ReportFilters {
  priority?: Priority[];
  status?: ReportStatus[];
  agent?: string;
  location?: string;
  searchTerm?: string;
}

// Sort options
export type SortField = 'timestamp' | 'priority' | 'status' | 'agent';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
