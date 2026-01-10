import { query, queryOne, insert, execute } from "../lib/database.js";

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status?: "new" | "read" | "replied" | "archived";
  read_at?: Date | null;
  created_at: Date;
}

/**
 * Create a new contact submission
 */
export async function createContactSubmission(
  name: string,
  email: string,
  message: string,
  subject?: string
): Promise<ContactSubmission> {
  const id = await insert(
    `INSERT INTO contact_submissions (name, email, subject, message) 
     VALUES (?, ?, ?, ?)`,
    [name, email, subject || null, message]
  );

  const submission = await query<ContactSubmission>(
    "SELECT * FROM contact_submissions WHERE id = ?",
    [id]
  );

  return submission[0];
}

/**
 * Get all contact submissions (admin only)
 */
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return query<ContactSubmission>(
    "SELECT * FROM contact_submissions ORDER BY created_at DESC"
  );
}

/**
 * Get contact submission by ID (admin only)
 */
export async function getContactSubmissionById(
  id: number
): Promise<ContactSubmission | null> {
  return query<ContactSubmission>(
    "SELECT * FROM contact_submissions WHERE id = ?",
    [id]
  ).then((results) => results[0] || null);
}

/**
 * Update contact submission status (admin only)
 */
export async function updateContactSubmissionStatus(
  id: number,
  status: "new" | "read" | "replied" | "archived"
): Promise<ContactSubmission | null> {
  const readAt = status === "read" && !(await getContactSubmissionById(id))?.read_at
    ? new Date()
    : null;
  
  await execute(
    `UPDATE contact_submissions 
     SET status = ?, read_at = COALESCE(?, read_at) 
     WHERE id = ?`,
    [status, readAt, id]
  );
  
  return getContactSubmissionById(id);
}

/**
 * Mark contact submission as read (admin only)
 */
export async function markContactSubmissionAsRead(
  id: number
): Promise<ContactSubmission | null> {
  return updateContactSubmissionStatus(id, "read");
}
