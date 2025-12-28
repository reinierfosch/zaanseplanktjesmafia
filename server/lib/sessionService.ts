import { nanoid } from "nanoid";
import { query, queryOne, insert, execute } from "./database.js";

export interface AdminSession {
  sessionId: string;
  expiresAt: number;
}

// Session expiry time: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000;

// Admin password (should be in environment variable in production)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Use database if available, otherwise fallback to in-memory
const USE_DATABASE = process.env.DB_HOST && process.env.DB_NAME;

// Fallback: In-memory session storage
const sessions = new Map<string, AdminSession>();

/**
 * Verify admin password
 */
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Create a new admin session
 */
export async function createSession(): Promise<AdminSession> {
  const sessionId = nanoid();
  const expiresAt = Date.now() + SESSION_DURATION;

  const session: AdminSession = {
    sessionId,
    expiresAt,
  };

  if (!USE_DATABASE) {
    sessions.set(sessionId, session);
    cleanupExpiredSessions();
    return session;
  }

  try {
    await insert(
      "INSERT INTO admin_sessions (session_id, expires_at) VALUES (?, ?)",
      [sessionId, expiresAt]
    );
    return session;
  } catch (error) {
    console.error("Database error, falling back to in-memory:", error);
    sessions.set(sessionId, session);
    cleanupExpiredSessions();
    return session;
  }
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<AdminSession | null> {
  if (!USE_DATABASE) {
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

  try {
    const row = await queryOne<any>(
      "SELECT * FROM admin_sessions WHERE session_id = ?",
      [sessionId]
    );

    if (!row) {
      return null;
    }

    // Check if session is expired
    if (Date.now() > row.expires_at) {
      await execute("DELETE FROM admin_sessions WHERE session_id = ?", [sessionId]);
      return null;
    }

    return {
      sessionId: row.session_id,
      expiresAt: row.expires_at,
    };
  } catch (error) {
    console.error("Database error, falling back to in-memory:", error);
    const session = sessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionId);
      return null;
    }

    return session;
  }
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
  if (!USE_DATABASE) {
    return sessions.delete(sessionId);
  }

  try {
    const affectedRows = await execute(
      "DELETE FROM admin_sessions WHERE session_id = ?",
      [sessionId]
    );
    return affectedRows > 0;
  } catch (error) {
    console.error("Database error, falling back to in-memory:", error);
    return sessions.delete(sessionId);
  }
}

/**
 * Verify session is valid
 */
export async function verifySession(sessionId: string): Promise<boolean> {
  const session = await getSession(sessionId);
  return session !== null;
}

/**
 * Clean up expired sessions (in-memory fallback)
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  const sessionIds = Array.from(sessions.keys());
  for (const sessionId of sessionIds) {
    const session = sessions.get(sessionId);
    if (session && now > session.expiresAt) {
      sessions.delete(sessionId);
    }
  }
}

// Clean up expired sessions every hour (in-memory and database)
setInterval(async () => {
  if (!USE_DATABASE) {
    cleanupExpiredSessions();
    return;
  }

  try {
    await execute(
      "DELETE FROM admin_sessions WHERE expires_at < ?",
      [Date.now()]
    );
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
    cleanupExpiredSessions(); // Fallback to in-memory cleanup
  }
}, 60 * 60 * 1000);
