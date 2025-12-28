import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

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

const DATA_DIR = path.resolve(__dirname, "..", "data");
const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
const UPLOADS_DIR = path.resolve(__dirname, "..", "uploads", "digital");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read artworks from JSON file
export async function getArtworks(): Promise<Artwork[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(ARTWORKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
}

// Get single artwork by ID
export async function getArtworkById(id: string): Promise<Artwork | null> {
  const artworks = await getArtworks();
  return artworks.find((a) => a.id === id) || null;
}

// Create new artwork
export async function createArtwork(
  artworkData: Omit<Artwork, "id" | "createdAt" | "updatedAt">
): Promise<Artwork> {
  await ensureDataDir();
  const artworks = await getArtworks();
  
  const newArtwork: Artwork = {
    ...artworkData,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  artworks.push(newArtwork);
  await fs.writeFile(ARTWORKS_FILE, JSON.stringify(artworks, null, 2), "utf-8");
  
  return newArtwork;
}

// Update artwork
export async function updateArtwork(
  id: string,
  updates: Partial<Omit<Artwork, "id" | "createdAt">>
): Promise<Artwork | null> {
  await ensureDataDir();
  const artworks = await getArtworks();
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

// Delete artwork
export async function deleteArtwork(id: string): Promise<boolean> {
  await ensureDataDir();
  const artworks = await getArtworks();
  const artwork = artworks.find((a) => a.id === id);
  
  if (!artwork) {
    return false; // Artwork not found
  }

  // Delete digital file if it exists
  if (artwork.digitalFile) {
    const digitalFilePath = path.join(UPLOADS_DIR, artwork.digitalFile);
    try {
      await fs.unlink(digitalFilePath);
    } catch (error: any) {
      // File might not exist, log but don't fail
      console.warn(`Could not delete digital file: ${digitalFilePath}`, error.message);
    }
  }

  const filtered = artworks.filter((a) => a.id !== id);
  await fs.writeFile(ARTWORKS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  
  return true;
}

