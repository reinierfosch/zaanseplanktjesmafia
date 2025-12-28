import { initDatabase, query, insert, beginTransaction, commit, rollback } from "../lib/database.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Migration script to migrate data from JSON files to MySQL database
 */
async function migrateToMySQL() {
  console.log("Starting migration to MySQL...");

  // Initialize database
  initDatabase();

  // Check if database is available
  try {
    await query("SELECT 1");
    console.log("✓ Database connection successful");
  } catch (error) {
    console.error("✗ Database connection failed:", error);
    process.exit(1);
  }

  const connection = await beginTransaction();

  try {
    // 1. Migrate artworks
    console.log("\nMigrating artworks...");
    const artworksPath = path.resolve(__dirname, "..", "data", "artworks.json");
    
    try {
      const artworksData = await fs.readFile(artworksPath, "utf-8");
      const artworks = JSON.parse(artworksData);

      for (const artwork of artworks) {
        try {
          await connection.query(
            `INSERT INTO artworks (id, title, image, category, description, available, rotation, available_products, digital_file, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               title = VALUES(title),
               image = VALUES(image),
               category = VALUES(category),
               description = VALUES(description),
               available = VALUES(available),
               rotation = VALUES(rotation),
               available_products = VALUES(available_products),
               digital_file = VALUES(digital_file),
               updated_at = VALUES(updated_at)`,
            [
              artwork.id,
              artwork.title,
              artwork.image,
              artwork.category,
              artwork.description || null,
              artwork.available ? 1 : 0,
              artwork.rotation || null,
              artwork.availableProducts ? JSON.stringify(artwork.availableProducts) : null,
              artwork.digitalFile || null,
              artwork.createdAt || new Date().toISOString(),
              artwork.updatedAt || new Date().toISOString(),
            ]
          );
        } catch (error: any) {
          console.warn(`  ⚠ Skipping artwork ${artwork.id}:`, error.message);
        }
      }

      console.log(`  ✓ Migrated ${artworks.length} artworks`);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      console.log("  ℹ No artworks.json file found, skipping");
    }

    // 2. Migrate orders
    console.log("\nMigrating orders...");
    const ordersPath = path.resolve(__dirname, "..", "data", "orders.json");
    
    try {
      const ordersData = await fs.readFile(ordersPath, "utf-8");
      const orders = JSON.parse(ordersData);

      for (const order of orders) {
        try {
          await connection.query(
            `INSERT INTO orders (id, artwork_id, order_type, options, inspiration, contact_name, contact_email, contact_phone, contact_message, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               artwork_id = VALUES(artwork_id),
               order_type = VALUES(order_type),
               options = VALUES(options),
               inspiration = VALUES(inspiration),
               contact_name = VALUES(contact_name),
               contact_email = VALUES(contact_email),
               contact_phone = VALUES(contact_phone),
               contact_message = VALUES(contact_message)`,
            [
              order.id,
              order.artworkId || null,
              order.orderType,
              order.options ? JSON.stringify(order.options) : null,
              order.inspiration || null,
              order.contactInfo.name,
              order.contactInfo.email,
              order.contactInfo.phone || null,
              order.contactInfo.message || null,
              order.createdAt || new Date().toISOString(),
            ]
          );
        } catch (error: any) {
          console.warn(`  ⚠ Skipping order ${order.id}:`, error.message);
        }
      }

      console.log(`  ✓ Migrated ${orders.length} orders`);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      console.log("  ℹ No orders.json file found, skipping");
    }

    // Commit transaction
    await commit(connection);
    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    await rollback(connection);
    console.error("\n✗ Migration failed, rolled back:", error);
    process.exit(1);
  }
}

// Run migration
migrateToMySQL().catch(console.error);

