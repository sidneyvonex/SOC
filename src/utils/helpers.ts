import { Priority, ReportStatus } from '../types';

/**
 * Utility functions for the SOC Dashboard
 */

// Priority color coding for visual distinction
export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case Priority.CRITICAL:
      return '#dc2626'; // red-600
    case Priority.HIGH:
      return '#ea580c'; // orange-600
    case Priority.MEDIUM:
      return '#ca8a04'; // yellow-600
    case Priority.LOW:
      return '#16a34a'; // green-600
    default:
      return '#6b7280'; // gray-500
  }
};

// Status color coding
export const getStatusColor = (status: ReportStatus): string => {
  switch (status) {
    case ReportStatus.NEW:
      return '#3b82f6'; // blue-500
    case ReportStatus.REVIEWED:
      return '#8b5cf6'; // violet-500
    case ReportStatus.ACTIONED:
      return '#10b981'; // emerald-500
    case ReportStatus.CLOSED:
      return '#6b7280'; // gray-500
    default:
      return '#6b7280';
  }
};

// Priority sorting order (for sorting reports by urgency)
export const priorityOrder: Record<Priority, number> = {
  [Priority.CRITICAL]: 0,
  [Priority.HIGH]: 1,
  [Priority.MEDIUM]: 2,
  [Priority.LOW]: 3,
};

// Format timestamp for display
export const formatTimestamp = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Generate unique ID (simple implementation - in production use UUID)
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Input sanitization to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Simple password strength check
export const isPasswordStrong = (password: string): boolean => {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return minLength && hasUpper && hasLower && hasNumber;
};

// Hash password (simplified for demo - in production use bcrypt or similar)
export const hashPassword = (password: string): string => {
  // WARNING: This is NOT secure for production
  // Use bcrypt, scrypt, or similar in real applications
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `DEMO_HASH_${Math.abs(hash).toString(16)}`;
};
