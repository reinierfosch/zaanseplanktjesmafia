import { z } from "zod";

/**
 * Newsletter subscription form validation schema
 */
export const newsletterSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 karakters bevatten").max(100, "Naam is te lang").optional(),
  email: z.string().email("Voer een geldig e-mailadres in").min(1, "E-mailadres is verplicht"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

/**
 * Order request validation schema
 */
export const orderRequestSchema = z.object({
  artworkId: z.string().optional(),
  orderType: z.enum(["original", "derivative", "tshirt", "custom", "mug", "notebook", "poster", "canvas", "sticker", "tote-bag"]),
  options: z.object({
    thinnerWood: z.boolean().optional(),
    differentFinish: z.boolean().optional(),
    fewerColors: z.boolean().optional(),
  }).optional(),
  inspiration: z.string().optional(),
  contactInfo: z.object({
    name: z.string().min(2, "Naam moet minimaal 2 karakters bevatten"),
    email: z.string().email("Voer een geldig e-mailadres in"),
    phone: z.string().optional(),
    message: z.string().optional(),
  }),
});

export type OrderRequestFormData = z.infer<typeof orderRequestSchema>;

/**
 * Artwork validation schema
 */
export const artworkSchema = z.object({
  title: z.string().min(1, "Titel is verplicht"),
  image: z.string().min(1, "Afbeelding is verplicht"),
  category: z.enum(["grafische-kunst", "gedichten", "tekst", "combinatie"]),
  description: z.string().optional(),
  available: z.boolean(),
  rotation: z.number().optional(),
  availableProducts: z.array(z.enum(["tshirt", "mug", "notebook", "poster", "canvas", "sticker", "tote-bag"])).optional(),
  digitalFile: z.string().optional(),
});

export type ArtworkFormData = z.infer<typeof artworkSchema>;

/**
 * Admin login validation schema
 */
export const adminLoginSchema = z.object({
  password: z.string().min(1, "Wachtwoord is verplicht"),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

