import { nanoid } from "nanoid";

export interface AdminSession {
  sessionId: string;
  expiresAt: number;
}

// In-memory session storage (can be migrated to Redis/database later)
const sessions = new Map<string, AdminSession>();

// Session expiry time: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Admin password (should be in environment variable in production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/**
 * Verify admin password
 */
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Create a new admin session
 */
export function createSession(): AdminSession {
  const sessionId = nanoid();
  const expiresAt = Date.now() + SESSION_DURATION;

  const session: AdminSession = {
    sessionId,
    expiresAt,
  };

  sessions.set(sessionId, session);
  
  // Clean up expired sessions periodically
  cleanupExpiredSessions();

  return session;
}

/**
 * Get session by ID
 */
export function getSession(sessionId: string): AdminSession | null {
  const session = sessions.get(sessionId);
  
  if (!session) {
    return null;
  }

  // Check if session is expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

/**
 * Delete session
 */
export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

/**
 * Verify session is valid
 */
export function verifySession(sessionId: string): boolean {
  const session = getSession(sessionId);
  return session !== null;
}

/**
 * Clean up expired sessions
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
}

// Clean up expired sessions every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

