import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, FieldReport, AuditLog } from '../types';
import { ClearanceLevel, Priority } from '../types';
import { hashPassword, generateId } from '../utils/helpers';
import { STORAGE_KEYS, SECURITY_CONFIG, DEMO_USERS } from '../constants';

/**
 * Authentication Context Provider
 * Handles user authentication, authorization, and session management
 * 
 * Security considerations:
 * - Session timeout after inactivity
 * - Login attempt limiting
 * - Audit logging of all authentication events
 * - Role-based access control
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user database (in production, this would be a secure backend)
const USERS: User[] = [
  {
    id: '1',
    username: DEMO_USERS.analyst.username,
    passwordHash: hashPassword(DEMO_USERS.analyst.password),
    clearanceLevel: ClearanceLevel.ANALYST,
    fullName: 'Analyst User',
    createdAt: new Date('2026-01-01'),
    isActive: true
  },
  {
    id: '2',
    username: DEMO_USERS.commander.username,
    passwordHash: hashPassword(DEMO_USERS.commander.password),
    clearanceLevel: ClearanceLevel.FIELD_COMMANDER,
    fullName: 'Field Commander',
    createdAt: new Date('2026-01-01'),
    isActive: true
  },
  {
    id: '3',
    username: DEMO_USERS.admin.username,
    passwordHash: hashPassword(DEMO_USERS.admin.password),
    clearanceLevel: ClearanceLevel.ADMIN,
    fullName: 'System Administrator',
    createdAt: new Date('2026-01-01'),
    isActive: true
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Restore session on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        logAuditEvent('LOGIN', userData.username, 'Session restored');
      } catch (error) {
        console.error('Failed to restore session:', error);
        sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }
    }
  }, []);

  // Session timeout monitoring
  useEffect(() => {
    if (!user) return;

    const checkTimeout = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      if (elapsed > SECURITY_CONFIG.SESSION_TIMEOUT_MS) {
        logAuditEvent('LOGOUT', user.username, 'Session timeout');
        logout();
        alert('Session expired due to inactivity. Please log in again.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTimeout);
  }, [user, lastActivity]);

  // Update activity timestamp on user interaction
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [user]);

  /**
   * Log audit events for security tracking
   */
  const logAuditEvent = (
    action: AuditLog['action'],
    username: string,
    details: string
  ) => {
    if (!SECURITY_CONFIG.LOG_ALL_ACTIONS) return;

    const auditLog: AuditLog = {
      id: generateId(),
      timestamp: new Date(),
      userId: user?.id || 'unknown',
      username,
      action,
      details
    };

    // Store in sessionStorage (in production, send to secure backend)
    const logs = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.AUDIT_LOGS) || '[]');
    logs.push(auditLog);
    sessionStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));

    console.log('[AUDIT]', auditLog);
  };

  /**
   * Authenticate user
   * Returns true if successful, false otherwise
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const hashedPassword = hashPassword(password);
      const foundUser = USERS.find(
        u => u.username === username && u.passwordHash === hashedPassword && u.isActive
      );

      if (foundUser) {
        const userWithLogin = {
          ...foundUser,
          lastLogin: new Date()
        };

        setUser(userWithLogin);
        setLastActivity(Date.now());
        
        // Store in sessionStorage (more secure than localStorage for sensitive data)
        sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userWithLogin));
        
        logAuditEvent('LOGIN', username, `Successful login as ${userWithLogin.clearanceLevel}`);
        return true;
      } else {
        logAuditEvent('LOGIN', username, 'Failed login attempt - invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Log out current user
   */
  const logout = () => {
    if (user) {
      logAuditEvent('LOGOUT', user.username, 'User logged out');
    }
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  };

  /**
   * Check if user can view a specific report based on clearance level
   * 
   * Access Rules:
   * - ANALYST: Can view LOW and MEDIUM priority reports only
   * - FIELD_COMMANDER: Can view all reports
   * - ADMIN: Can view all reports
   */
  const canViewReport = (report: FieldReport): boolean => {
    if (!user) return false;

    switch (user.clearanceLevel) {
      case ClearanceLevel.ANALYST:
        // Analysts only see LOW and MEDIUM priority
        return report.priority === Priority.LOW || report.priority === Priority.MEDIUM;
      
      case ClearanceLevel.FIELD_COMMANDER:
      case ClearanceLevel.ADMIN:
        // Commanders and Admins see everything
        return true;
      
      default:
        return false;
    }
  };

  /**
   * Check if user can edit a report (change status)
   * 
   * Edit Rules:
   * - ANALYST: Read-only access
   * - FIELD_COMMANDER: Can change status on all reports they can view
   * - ADMIN: Can change status on all reports
   */
  const canEditReport = (report: FieldReport): boolean => {
    if (!user) return false;

    switch (user.clearanceLevel) {
      case ClearanceLevel.ANALYST:
        return false; // Analysts are read-only
      
      case ClearanceLevel.FIELD_COMMANDER:
      case ClearanceLevel.ADMIN:
        return canViewReport(report); // Can edit what they can view
      
      default:
        return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    canViewReport,
    canEditReport
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
