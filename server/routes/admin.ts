import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { requireAdmin } from "../middleware/auth.js";
import * as artworkService from "../services/artworkService.js";
import * as orderService from "../services/orderService.js";
import * as newsletterService from "../services/newsletterService.js";
import * as contactService from "../services/contactService.js";
import * as sessionService from "../services/sessionService.js";

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit form submissions to 5 per 15 minutes
  message: "Too many form submissions, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIR = process.env.NODE_ENV === "production" 
  ? path.resolve(__dirname, "..", "..")
  : path.resolve(__dirname, "..");

const UPLOADS_DIR = path.resolve(BASE_DIR, "server", "uploads", "digital");

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// Allowed file types for digital artwork
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "application/pdf",
  "application/postscript",
  "application/illustrator",
];

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".pdf", ".ai", ".eps"];

// Multer configuration
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const artworkId = req.params.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = `${artworkId}_${timestamp}${ext}`;
    cb(null, sanitizedName);
  },
});

const fileFilter = (_req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Bestandstype niet toegestaan. Toegestane types: PNG, JPG, SVG, PDF, AI, EPS`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

const router = express.Router();

// Admin authentication endpoints
router.post("/login", formLimiter, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required" });
    }

    if (!sessionService.verifyPassword(password)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const session = await sessionService.createSession();
    res.json({ sessionId: session.sessionId, expiresAt: session.expiresAt });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace("Bearer ", "") || (req as any).cookies?.sessionId;
    if (sessionId) {
      await sessionService.deleteSession(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during admin logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const sessionId = req.headers.authorization?.replace("Bearer ", "") || (req as any).cookies?.sessionId;
    const session = sessionId ? await sessionService.getSession(sessionId) : null;

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({ authenticated: true, expiresAt: session.expiresAt });
  } catch (error) {
    console.error("Error checking admin session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard endpoint
router.get("/dashboard", requireAdmin, async (_req, res) => {
  try {
    const [artworks, orders, newsletter, contact] = await Promise.all([
      artworkService.getArtworks(),
      orderService.getOrders(),
      newsletterService.getAllSubscriptions(),
      contactService.getContactSubmissions(),
    ]);

    const stats = {
      artworks: {
        total: artworks.length,
        available: artworks.filter((a) => a.available).length,
      },
      orders: {
        total: orders.length,
        recent: orders.filter((o) => {
          const createdAt = new Date(o.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdAt > weekAgo;
        }).length,
      },
      newsletter: {
        total: newsletter.length,
        active: newsletter.filter((s) => s.status === "active").length,
      },
      contact: {
        total: contact.length,
        unread: contact.filter((c) => !c.status || c.status === "new").length,
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Orders endpoints
router.get("/orders", requireAdmin, async (_req, res) => {
  try {
    const orders = await orderService.getOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Newsletter endpoints
router.get("/newsletter", requireAdmin, async (_req, res) => {
  try {
    const subscriptions = await newsletterService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching newsletter subscriptions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Contact endpoints
router.get("/contact", requireAdmin, async (_req, res) => {
  try {
    const submissions = await contactService.getContactSubmissions();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/contact/:id/status", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status || !["new", "read", "replied", "archived"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const submission = await contactService.updateContactSubmissionStatus(id, status);
    if (!submission) {
      return res.status(404).json({ error: "Contact submission not found" });
    }

    res.json(submission);
  } catch (error) {
    console.error("Error updating contact submission status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/contact/:id/read", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const submission = await contactService.markContactSubmissionAsRead(id);
    if (!submission) {
      return res.status(404).json({ error: "Contact submission not found" });
    }
    res.json(submission);
  } catch (error) {
    console.error("Error marking contact submission as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Artworks endpoints
router.get("/artworks", requireAdmin, async (_req, res) => {
  try {
    const artworks = await artworkService.getArtworks();
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/artworks", requireAdmin, async (req, res) => {
  try {
    const { title, image, category, description, available, rotation, availableProducts, digitalFile } = req.body;

    if (!title || !image || !category) {
      return res.status(400).json({ error: "Title, image, and category are required" });
    }

    const artwork = await artworkService.createArtwork({
      title,
      image,
      category,
      description,
      available: available !== undefined ? available : true,
      rotation,
      availableProducts,
      digitalFile,
    });

    res.status(201).json(artwork);
  } catch (error) {
    console.error("Error creating artwork:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/artworks/:id", requireAdmin, async (req, res) => {
  try {
    const { title, image, category, description, available, rotation, availableProducts, digitalFile } = req.body;
    const artwork = await artworkService.updateArtwork(req.params.id, {
      title,
      image,
      category,
      description,
      available,
      rotation,
      availableProducts,
      digitalFile,
    });

    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found" });
    }

    res.json(artwork);
  } catch (error) {
    console.error("Error updating artwork:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/artworks/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await artworkService.deleteArtwork(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting artwork:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Digital file upload endpoint
router.post("/artworks/:id/upload-digital", requireAdmin, upload.single("digitalFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Geen bestand geüpload" });
    }

    const artworkId = req.params.id;
    const artwork = await artworkService.getArtworkById(artworkId);
    
    if (!artwork) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ error: "Kunstwerk niet gevonden" });
    }

    // Delete old digital file if it exists
    if (artwork.digitalFile) {
      const oldFilePath = path.join(UPLOADS_DIR, artwork.digitalFile);
      await fs.unlink(oldFilePath).catch(() => {});
    }

    // Update artwork with new digital file
    const updatedArtwork = await artworkService.updateArtwork(artworkId, {
      digitalFile: req.file.filename,
    });

    if (!updatedArtwork) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ error: "Kunstwerk niet gevonden" });
    }

    res.json({ 
      message: "Digitale bestand succesvol geüpload",
      filename: req.file.filename,
      artwork: updatedArtwork,
    });
  } catch (error: any) {
    console.error("Error uploading digital file:", error);
    
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    if (error.message && error.message.includes("Bestandstype")) {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Bestand is te groot. Maximum grootte: 50MB" });
    }

    res.status(500).json({ error: "Fout bij uploaden van digitaal bestand" });
  }
});

// Digital file download endpoint
router.get("/artworks/:id/digital-file", requireAdmin, async (req, res) => {
  try {
    const artworkId = req.params.id;
    const artwork = await artworkService.getArtworkById(artworkId);
    
    if (!artwork || !artwork.digitalFile) {
      return res.status(404).json({ error: "Digitaal bestand niet gevonden" });
    }

    const filePath = path.join(UPLOADS_DIR, artwork.digitalFile);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: "Bestand niet gevonden op server" });
    }

    const ext = path.extname(artwork.digitalFile).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".ai": "application/postscript",
      ".eps": "application/postscript",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";
    
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${artwork.digitalFile}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error downloading digital file:", error);
    res.status(500).json({ error: "Fout bij downloaden van digitaal bestand" });
  }
});

// Digital file delete endpoint
router.delete("/artworks/:id/digital-file", requireAdmin, async (req, res) => {
  try {
    const artworkId = req.params.id;
    const artwork = await artworkService.getArtworkById(artworkId);
    
    if (!artwork || !artwork.digitalFile) {
      return res.status(404).json({ error: "Digitaal bestand niet gevonden" });
    }

    const filePath = path.join(UPLOADS_DIR, artwork.digitalFile);
    
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.error("Error deleting digital file:", error);
      }
    }

    const updatedArtwork = await artworkService.updateArtwork(artworkId, {
      digitalFile: undefined,
    });

    if (!updatedArtwork) {
      return res.status(404).json({ error: "Kunstwerk niet gevonden" });
    }

    res.json({ 
      message: "Digitaal bestand succesvol verwijderd",
      artwork: updatedArtwork,
    });
  } catch (error) {
    console.error("Error deleting digital file:", error);
    res.status(500).json({ error: "Fout bij verwijderen van digitaal bestand" });
  }
});

export default router;

