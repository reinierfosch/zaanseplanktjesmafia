import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

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

const DATA_DIR = path.resolve(__dirname, "..", "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Create new order request
export async function createOrderRequest(
  orderData: Omit<OrderRequest, "id" | "createdAt">
): Promise<OrderRequest> {
  await ensureDataDir();
  
  let orders: OrderRequest[] = [];
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    orders = JSON.parse(data);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const newOrder: OrderRequest = {
    ...orderData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");

  // Log order for now (can be replaced with email service later)
  console.log("New order request:", JSON.stringify(newOrder, null, 2));

  return newOrder;
}

// Get all orders (admin only)
export async function getOrders(): Promise<OrderRequest[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
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

