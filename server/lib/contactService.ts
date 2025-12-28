import { query, insert } from "./database.js";

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
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

