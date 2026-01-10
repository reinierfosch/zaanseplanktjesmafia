import { query, queryOne, insert, execute } from "../lib/database.js";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type ProductType = "tshirt" | "mug" | "notebook" | "poster" | "canvas" | "sticker" | "tote-bag";

export interface Artwork {
  id: string;
  title: string;
  image: string;
  category: "grafische-kunst" | "gedichten" | "tekst" | "combinatie";
  description?: string;
  available: boolean;
  rotation?: number;
  availableProducts?: ProductType[];
  digitalFile?: string;
  createdAt: string;
  updatedAt: string;
}

// Determine base directory - in production (bundled), __dirname is dist/, so go up one level
// In development, __dirname is server/services/, so we need to handle both cases
const BASE_DIR = process.env.NODE_ENV === "production" 
  ? path.resolve(__dirname, "..", "..")
  : path.resolve(__dirname, "..");

const UPLOADS_DIR = path.resolve(BASE_DIR, "uploads", "digital");

// Use database if available, otherwise fallback to JSON
const USE_DATABASE = process.env.DB_HOST && process.env.DB_NAME;

// Fallback: Read artworks from JSON file
async function getArtworksFromJSON(): Promise<Artwork[]> {
  const DATA_DIR = process.env.NODE_ENV === "production"
    ? path.resolve(BASE_DIR, "server", "data")
    : path.resolve(BASE_DIR, "data");
  const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
  
  try {
    await fs.access(ARTWORKS_FILE);
    const data = await fs.readFile(ARTWORKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

// Get all artworks
export async function getArtworks(): Promise<Artwork[]> {
  if (!USE_DATABASE) {
    return getArtworksFromJSON();
  }

  try {
    const rows = await query<any>(
      "SELECT * FROM artworks ORDER BY created_at DESC"
    );

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      image: row.image,
      category: row.category,
      description: row.description || undefined,
      available: Boolean(row.available),
      rotation: row.rotation || undefined,
      availableProducts: row.available_products
        ? JSON.parse(row.available_products)
        : undefined,
      digitalFile: row.digital_file || undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }));
  } catch (error) {
    console.error("Database error, falling back to JSON:", error);
    return getArtworksFromJSON();
  }
}

// Get single artwork by ID
export async function getArtworkById(id: string): Promise<Artwork | null> {
  if (!USE_DATABASE) {
    const artworks = await getArtworksFromJSON();
    return artworks.find((a) => a.id === id) || null;
  }

  try {
    const row = await queryOne<any>("SELECT * FROM artworks WHERE id = ?", [id]);

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      image: row.image,
      category: row.category,
      description: row.description || undefined,
      available: Boolean(row.available),
      rotation: row.rotation || undefined,
      availableProducts: row.available_products
        ? JSON.parse(row.available_products)
        : undefined,
      digitalFile: row.digital_file || undefined,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  } catch (error) {
    console.error("Database error, falling back to JSON:", error);
    const artworks = await getArtworksFromJSON();
    return artworks.find((a) => a.id === id) || null;
  }
}

// Create new artwork
export async function createArtwork(
  artworkData: Omit<Artwork, "id" | "createdAt" | "updatedAt">
): Promise<Artwork> {
  const newArtwork: Artwork = {
    ...artworkData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!USE_DATABASE) {
    const DATA_DIR = path.resolve(BASE_DIR, "server", "data");
    const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
    
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {}
    
    const artworks = await getArtworksFromJSON();
    artworks.push(newArtwork);
    await fs.writeFile(ARTWORKS_FILE, JSON.stringify(artworks, null, 2), "utf-8");
    return newArtwork;
  }

  try {
    await insert(
      `INSERT INTO artworks (id, title, image, category, description, available, rotation, available_products, digital_file)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newArtwork.id,
        newArtwork.title,
        newArtwork.image,
        newArtwork.category,
        newArtwork.description || null,
        newArtwork.available ? 1 : 0,
        newArtwork.rotation || null,
        newArtwork.availableProducts
          ? JSON.stringify(newArtwork.availableProducts)
          : null,
        newArtwork.digitalFile || null,
      ]
    );

    return newArtwork;
  } catch (error) {
    console.error("Database error, falling back to JSON:", error);
    // Fallback to JSON
    const DATA_DIR = path.resolve(BASE_DIR, "server", "data");
    const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
    
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
    } catch {}
    
    const artworks = await getArtworksFromJSON();
    artworks.push(newArtwork);
    await fs.writeFile(ARTWORKS_FILE, JSON.stringify(artworks, null, 2), "utf-8");
    return newArtwork;
  }
}

// Update artwork
export async function updateArtwork(
  id: string,
  updates: Partial<Omit<Artwork, "id" | "createdAt">>
): Promise<Artwork | null> {
  if (!USE_DATABASE) {
    const DATA_DIR = path.resolve(BASE_DIR, "server", "data");
    const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
    
    const artworks = await getArtworksFromJSON();
    const index = artworks.findIndex((a) => a.id === id);

    if (index === -1) {
      return null;
    }

    artworks[index] = {
      ...artworks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(ARTWORKS_FILE, JSON.stringify(artworks, null, 2), "utf-8");
    return artworks[index];
  }

  try {
    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updates.title !== undefined) {
      updateFields.push("title = ?");
      updateValues.push(updates.title);
    }
    if (updates.image !== undefined) {
      updateFields.push("image = ?");
      updateValues.push(updates.image);
    }
    if (updates.category !== undefined) {
      updateFields.push("category = ?");
      updateValues.push(updates.category);
    }
    if (updates.description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(updates.description || null);
    }
    if (updates.available !== undefined) {
      updateFields.push("available = ?");
      updateValues.push(updates.available ? 1 : 0);
    }
    if (updates.rotation !== undefined) {
      updateFields.push("rotation = ?");
      updateValues.push(updates.rotation || null);
    }
    if (updates.availableProducts !== undefined) {
      updateFields.push("available_products = ?");
      updateValues.push(
        updates.availableProducts
          ? JSON.stringify(updates.availableProducts)
          : null
      );
    }
    if (updates.digitalFile !== undefined) {
      updateFields.push("digital_file = ?");
      updateValues.push(updates.digitalFile || null);
    }

    if (updateFields.length === 0) {
      return await getArtworkById(id);
    }

    updateValues.push(id);

    await execute(
      `UPDATE artworks SET ${updateFields.join(", ")}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );

    return await getArtworkById(id);
  } catch (error) {
    console.error("Database error, falling back to JSON:", error);
    // Fallback to JSON
    const DATA_DIR = path.resolve(BASE_DIR, "server", "data");
    const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
    
    const artworks = await getArtworksFromJSON();
    const index = artworks.findIndex((a) => a.id === id);

    if (index === -1) {
      return null;
    }

    artworks[index] = {
      ...artworks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(ARTWORKS_FILE, JSON.stringify(artworks, null, 2), "utf-8");
    return artworks[index];
  }
}

// Delete artwork
export async function deleteArtwork(id: string): Promise<boolean> {
  const artwork = await getArtworkById(id);

  if (!artwork) {
    return false;
  }

  // Delete digital file if it exists
  if (artwork.digitalFile) {
    const digitalFilePath = path.join(UPLOADS_DIR, artwork.digitalFile);
    try {
      await fs.unlink(digitalFilePath);
    } catch (error: any) {
      console.warn(
        `Could not delete digital file: ${digitalFilePath}`,
        error.message
      );
    }
  }

  if (!USE_DATABASE) {
    const DATA_DIR = path.resolve(BASE_DIR, "server", "data");
    const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
    
    const artworks = await getArtworksFromJSON();
    const filtered = artworks.filter((a) => a.id !== id);
    await fs.writeFile(ARTWORKS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }

  try {
    const affectedRows = await execute("DELETE FROM artworks WHERE id = ?", [id]);
    return affectedRows > 0;
  } catch (error) {
    console.error("Database error, falling back to JSON:", error);
    // Fallback to JSON
    const DATA_DIR = path.resolve(BASE_DIR, "server", "data");
    const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
    
    const artworks = await getArtworksFromJSON();
    const filtered = artworks.filter((a) => a.id !== id);
    await fs.writeFile(ARTWORKS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
}
