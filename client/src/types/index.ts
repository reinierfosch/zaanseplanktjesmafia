/**
 * Type definitions for the application
 */

export type ArtworkCategory = "grafische-kunst" | "gedichten" | "tekst" | "combinatie";

export type ProductType = "tshirt" | "mug" | "notebook" | "poster" | "canvas" | "sticker" | "tote-bag";

export interface Artwork {
  id: string;
  title: string;
  image: string;
  category: ArtworkCategory;
  description?: string;
  available: boolean;
  rotation?: number;
  availableProducts?: ProductType[];
  digitalFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workshop {
  id: string;
  title: string;
  desc: string;
  price: string;
  duration: string;
  features: string[];
}

export interface Feature {
  title: string;
  desc: string;
}

export type TabId = "home" | "gallery" | "workshops" | "contact";

// Order types - includes all product types
export type OrderType = "original" | "derivative" | "custom" | ProductType;

export interface DerivativeOptions {
  thinnerWood: boolean;
  differentFinish: boolean;
  fewerColors: boolean;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface OrderRequest {
  artworkId?: string;
  orderType: OrderType;
  options?: DerivativeOptions;
  inspiration?: string;
  contactInfo: ContactInfo;
}

export interface AdminSession {
  sessionId: string;
  expiresAt: number;
}

