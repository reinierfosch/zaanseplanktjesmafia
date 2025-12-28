import { query, insert } from "./database.js";
import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type ProductType = "tshirt" | "mug" | "notebook" | "poster" | "canvas" | "sticker" | "tote-bag";
export type OrderType = "original" | "derivative" | "custom" | ProductType;

export interface OrderRequest {
  id: string;
  artworkId?: string;
  orderType: OrderType;
  options?: {
    thinnerWood?: boolean;
    differentFinish?: boolean;
    fewerColors?: boolean;
  };
  inspiration?: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  };
  createdAt: string;
}

// Determine base directory - in production (bundled), __dirname is dist/, so go up one level
// In development, __dirname is server/lib/, so we need to handle both cases
const BASE_DIR = process.env.NODE_ENV === "production" 
  ? path.resolve(__dirname, "..", "..")
  : path.resolve(__dirname, "..");

const DATA_DIR = path.resolve(BASE_DIR, "server", "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Use database if available, otherwise fallback to JSON
const USE_DATABASE = process.env.DB_HOST && process.env.DB_NAME;

// Fallback: Read orders from JSON file
async function getOrdersFromJSON(): Promise<OrderRequest[]> {
  try {
    await fs.access(ORDERS_FILE);
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

// Create new order request
export async function createOrderRequest(
  orderData: Omit<OrderRequest, "id" | "createdAt">
): Promise<OrderRequest> {
  const newOrder: OrderRequest = {
    ...orderData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
  };

  if (!USE_DATABASE) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {}
    
    const orders = await getOrdersFromJSON();
    orders.push(newOrder);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    console.log("New order request:", JSON.stringify(newOrder, null, 2));
    return newOrder;
  }

  try {
    await insert(
      `INSERT INTO orders (id, artwork_id, order_type, options, inspiration, contact_name, contact_email, contact_phone, contact_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newOrder.id,
        newOrder.artworkId || null,
        newOrder.orderType,
        newOrder.options ? JSON.stringify(newOrder.options) : null,
        newOrder.inspiration || null,
        newOrder.contactInfo.name,
        newOrder.contactInfo.email,
        newOrder.contactInfo.phone || null,
        newOrder.contactInfo.message || null,
      ]
    );

    console.log("New order request:", JSON.stringify(newOrder, null, 2));
    return newOrder;
  } catch (error) {
    console.error("Database error, falling back to JSON:", error);
    // Fallback to JSON
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {}
    
    const orders = await getOrdersFromJSON();
    orders.push(newOrder);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    console.log("New order request:", JSON.stringify(newOrder, null, 2));
    return newOrder;
  }
}

// Get all orders (admin only)
export async function getOrders(): Promise<OrderRequest[]> {
  if (!USE_DATABASE) {
    return getOrdersFromJSON();
  }

  try {
    const rows = await query<any>(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    return rows.map((row) => ({
      id: row.id,
      artworkId: row.artwork_id || undefined,
      orderType: row.order_type as OrderType,
      options: row.options ? JSON.parse(row.options) : undefined,
      inspiration: row.inspiration || undefined,
      contactInfo: {
        name: row.contact_name,
        email: row.contact_email,
        phone: row.contact_phone || undefined,
        message: row.contact_message || undefined,
      },
      createdAt: row.created_at.toISOString(),
    }));
  } catch (error) {
    console.error("Database error, falling back to JSON:", error);
    return getOrdersFromJSON();
  }
}

// Generate email template for order request
export function generateOrderEmail(order: OrderRequest, artworkTitle?: string): string {
  const orderTypeLabels: Record<string, string> = {
    original: "Origineel werk",
    derivative: "Afgeleide versie",
    tshirt: "T-shirt print",
    custom: "Custom origineel",
    mug: "Mok print",
    notebook: "Notebook print",
    poster: "Poster print",
    canvas: "Canvas print",
    sticker: "Sticker print",
    "tote-bag": "Tote bag print",
  };

  const optionsText = order.options
    ? Object.entries(order.options)
        .filter(([_, value]) => value === true)
        .map(([key]) => {
          const labels: Record<string, string> = {
            thinnerWood: "Dunner hout",
            differentFinish: "Andere afwerking",
            fewerColors: "Minder kleuren",
          };
          return labels[key] || key;
        })
        .join(", ")
    : "";

  const subject = `Offerte aanvraag voor ${artworkTitle || "kunstwerk"} - ${orderTypeLabels[order.orderType]}`;

  // Check if this is a POD product type
  const isPODProduct = ["tshirt", "mug", "notebook", "poster", "canvas", "sticker", "tote-bag"].includes(order.orderType);
  const digitalFileNote = isPODProduct ? "\n- Opmerking: Dit is een print-on-demand product. Digitaal bestand wordt gebruikt voor productie." : "";

  const body = `Beste Zaanse Plankjes Maffia,

Ik ben geïnteresseerd in:
- Kunstwerk: ${artworkTitle || "Niet gespecificeerd"}
- Type: ${orderTypeLabels[order.orderType]}${digitalFileNote}
${optionsText ? `- Opties: ${optionsText}` : ""}
${order.inspiration ? `- Inspiratie/verzoek: ${order.inspiration}` : ""}

Mijn contactgegevens:
- Naam: ${order.contactInfo.name}
- Email: ${order.contactInfo.email}
${order.contactInfo.phone ? `- Telefoon: ${order.contactInfo.phone}` : ""}
${order.contactInfo.message ? `\nExtra bericht:\n${order.contactInfo.message}` : ""}

Met vriendelijke groet,
${order.contactInfo.name}`;

  return `mailto:info@plankjesmaffia.nl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
