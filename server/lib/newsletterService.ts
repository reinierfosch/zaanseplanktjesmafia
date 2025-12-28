import { query, queryOne, insert, execute } from "./database.js";

export interface NewsletterSubscription {
  id: number;
  email: string;
  name?: string;
  subscribed_at: Date;
  unsubscribed_at?: Date;
  status: "active" | "unsubscribed";
}

/**
 * Subscribe to newsletter
 */
export async function subscribeToNewsletter(
  email: string,
  name?: string
): Promise<NewsletterSubscription> {
  // Check if already subscribed
  const existing = await queryOne<NewsletterSubscription>(
    "SELECT * FROM newsletter_subscriptions WHERE email = ?",
    [email]
  );

  if (existing) {
    if (existing.status === "active") {
      return existing; // Already subscribed
    }
    // Reactivate subscription
    await execute(
      `UPDATE newsletter_subscriptions 
       SET status = 'active', name = ?, subscribed_at = NOW(), unsubscribed_at = NULL 
       WHERE email = ?`,
      [name || existing.name, email]
    );
    const updated = await queryOne<NewsletterSubscription>(
      "SELECT * FROM newsletter_subscriptions WHERE email = ?",
      [email]
    );
    return updated!;
  }

  // Create new subscription
  const id = await insert(
    `INSERT INTO newsletter_subscriptions (email, name, status) 
     VALUES (?, ?, 'active')`,
    [email, name || null]
  );

  const subscription = await queryOne<NewsletterSubscription>(
    "SELECT * FROM newsletter_subscriptions WHERE id = ?",
    [id]
  );

  return subscription!;
}

/**
 * Unsubscribe from newsletter
 */
export async function unsubscribeFromNewsletter(
  email: string
): Promise<boolean> {
  const result = await execute(
    `UPDATE newsletter_subscriptions 
     SET status = 'unsubscribed', unsubscribed_at = NOW() 
     WHERE email = ? AND status = 'active'`,
    [email]
  );

  return result > 0;
}

/**
 * Get all active subscriptions
 */
export async function getActiveSubscriptions(): Promise<NewsletterSubscription[]> {
  return query<NewsletterSubscription>(
    "SELECT * FROM newsletter_subscriptions WHERE status = 'active' ORDER BY subscribed_at DESC"
  );
}

/**
 * Get subscription by email
 */
export async function getSubscriptionByEmail(
  email: string
): Promise<NewsletterSubscription | null> {
  return queryOne<NewsletterSubscription>(
    "SELECT * FROM newsletter_subscriptions WHERE email = ?",
    [email]
  );
}

/**
 * Get all subscriptions (admin only)
 */
export async function getAllSubscriptions(): Promise<NewsletterSubscription[]> {
  return query<NewsletterSubscription>(
    "SELECT * FROM newsletter_subscriptions ORDER BY subscribed_at DESC"
  );
}

