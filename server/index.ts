import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import multer from "multer";
import fs from "fs/promises";
import { initDatabase } from "./lib/database.js";
import * as artworkService from "./lib/artworkService.js";
import * as sessionService from "./lib/sessionService.js";
import * as orderService from "./lib/orderService.js";
import * as newsletterService from "./lib/newsletterService.js";
import * as contactService from "./lib/contactService.js";
import * as emailService from "./lib/emailService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine base directory - in production (bundled), __dirname is dist/, so go up one level
// In development, __dirname is server/, so we need to handle both cases
const BASE_DIR = process.env.NODE_ENV === "production" 
  ? path.resolve(__dirname, "..")
  : __dirname;

// Digital file upload configuration
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
  "application/postscript", // AI/EPS
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

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit form submissions to 5 per 15 minutes
  message: "Too many form submissions, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

async function startServer() {
  // Ensure uploads directory exists before starting
  try {
    await ensureUploadsDir();
    console.log("✓ Uploads directory ready");
  } catch (error) {
    console.error("⚠ Failed to create uploads directory:", error);
    // Continue anyway - will try again on first upload
  }

  // Initialize database if configured
  if (process.env.DB_HOST && process.env.DB_NAME) {
    try {
      initDatabase();
      console.log("✓ Database initialized");
    } catch (error) {
      console.warn("⚠ Database initialization failed, using JSON fallback:", error);
    }
  }

  const app = express();
  const server = createServer(app);

  // Subdomain detection middleware
  app.use((req, res, next) => {
    const hostname = req.hostname || req.get("host") || "";
    const subdomain = hostname.split(".")[0];
    
    if (subdomain === "admin") {
      (req as any).subdomain = "admin";
    } else if (subdomain === "staging") {
      (req as any).subdomain = "staging";
    } else if (subdomain === "api") {
      (req as any).subdomain = "api";
    } else {
      (req as any).subdomain = "main";
    }
    
    next();
  });

  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === "production" 
      ? process.env.ALLOWED_ORIGINS?.split(",") || "*"
      : "*",
    credentials: true,
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", apiLimiter);

  // Admin auth middleware
  const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const sessionId = req.headers.authorization?.replace("Bearer ", "") || (req as any).cookies?.sessionId;
    
    if (!sessionId || !(await sessionService.verifySession(sessionId))) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    next();
  };

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", formLimiter, async (req, res) => {
    try {
      const { email, name } = req.body;

      // Basic validation
      if (!email || typeof email !== "string") {
        return res.status(400).json({ 
          error: "Email is required and must be a string" 
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "Invalid email format" 
        });
      }

      // Subscribe to newsletter (stores in database)
      const subscription = await newsletterService.subscribeToNewsletter(email, name);

      // Send confirmation email (don't fail if email service is not configured)
      try {
        await emailService.sendNewsletterConfirmation(email, name);
      } catch (emailError) {
        console.warn("Failed to send newsletter confirmation email:", emailError);
        // Continue anyway - subscription was successful
      }

      res.status(200).json({ 
        message: "Successfully subscribed to newsletter",
        email: subscription.email,
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Internal server error. Please try again later.";
      if (error instanceof Error) {
        if (error.message.includes("table") && error.message.includes("doesn't exist")) {
          errorMessage = "Database configuration error. Please contact the administrator.";
        } else if (error.message.includes("connection") || error.message.includes("access denied")) {
          errorMessage = "Database connection error. Please contact the administrator.";
        } else {
          errorMessage = error.message;
        }
      }
      
      res.status(500).json({ 
        error: errorMessage
      });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", formLimiter, async (req, res) => {
    try {
      const { name, email, message, subject } = req.body;

      // Basic validation
      if (!name || typeof name !== "string") {
        return res.status(400).json({ 
          error: "Name is required and must be a string" 
        });
      }

      if (!email || typeof email !== "string") {
        return res.status(400).json({ 
          error: "Email is required and must be a string" 
        });
      }

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ 
          error: "Message is required and cannot be empty" 
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "Invalid email format" 
        });
      }

      // Store in database
      await contactService.createContactSubmission(name, email, message, subject);

      // Send notification email to admin
      await emailService.sendContactNotification({
        name,
        email,
        subject,
        message,
      });

      res.status(200).json({ 
        message: "Contact form submitted successfully",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ 
        error: "Internal server error. Please try again later." 
      });
    }
  });

  // Artworks endpoints
  app.get("/api/artworks", async (_req, res) => {
    try {
      const artworks = await artworkService.getArtworks();
      res.json(artworks);
    } catch (error) {
      console.error("Error fetching artworks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/artworks/:id", async (req, res) => {
    try {
      const artwork = await artworkService.getArtworkById(req.params.id);
      if (!artwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }
      res.json(artwork);
    } catch (error) {
      console.error("Error fetching artwork:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/artworks", requireAdmin as any, async (req, res) => {
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

  app.put("/api/artworks/:id", requireAdmin as any, async (req, res) => {
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

  app.delete("/api/artworks/:id", requireAdmin as any, async (req, res) => {
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
  app.post("/api/artworks/:id/upload-digital", requireAdmin as any, upload.single("digitalFile"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Geen bestand geüpload" });
      }

      const artworkId = req.params.id;
      const artwork = await artworkService.getArtworkById(artworkId);
      
      if (!artwork) {
        // Delete uploaded file if artwork doesn't exist
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(404).json({ error: "Kunstwerk niet gevonden" });
      }

      // Delete old digital file if it exists
      if (artwork.digitalFile) {
        const oldFilePath = path.join(UPLOADS_DIR, artwork.digitalFile);
        await fs.unlink(oldFilePath).catch(() => {
          // File might not exist, ignore error
        });
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
      
      // Delete uploaded file on error
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
  app.get("/api/artworks/:id/digital-file", requireAdmin as any, async (req, res) => {
    try {
      const artworkId = req.params.id;
      const artwork = await artworkService.getArtworkById(artworkId);
      
      if (!artwork || !artwork.digitalFile) {
        return res.status(404).json({ error: "Digitaal bestand niet gevonden" });
      }

      const filePath = path.join(UPLOADS_DIR, artwork.digitalFile);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ error: "Bestand niet gevonden op server" });
      }

      // Determine content type based on extension
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
  app.delete("/api/artworks/:id/digital-file", requireAdmin as any, async (req, res) => {
    try {
      const artworkId = req.params.id;
      const artwork = await artworkService.getArtworkById(artworkId);
      
      if (!artwork || !artwork.digitalFile) {
        return res.status(404).json({ error: "Digitaal bestand niet gevonden" });
      }

      const filePath = path.join(UPLOADS_DIR, artwork.digitalFile);
      
      // Delete physical file
      try {
        await fs.unlink(filePath);
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          console.error("Error deleting digital file:", error);
        }
      }

      // Remove digitalFile from artwork
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

  // Admin endpoints
  app.post("/api/admin/login", formLimiter, async (req, res) => {
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

  app.post("/api/admin/logout", async (req, res) => {
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

  app.get("/api/admin/me", async (req, res) => {
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

  // Order endpoints
  app.post("/api/orders", formLimiter, async (req, res) => {
    try {
      const { artworkId, orderType, options, inspiration, contactInfo } = req.body;

      if (!orderType || !contactInfo || !contactInfo.name || !contactInfo.email) {
        return res.status(400).json({ 
          error: "Order type and contact info (name, email) are required" 
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactInfo.email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const order = await orderService.createOrderRequest({
        artworkId,
        orderType,
        options,
        inspiration,
        contactInfo,
      });

      // Get artwork title if artworkId is provided
      let artworkTitle: string | undefined;
      if (artworkId) {
        const artwork = await artworkService.getArtworkById(artworkId);
        artworkTitle = artwork?.title;
      }

      // Send admin notification email
      await emailService.sendOrderNotification({
        id: order.id,
        artworkId: order.artworkId,
        orderType: order.orderType,
        contactInfo: order.contactInfo,
        artworkTitle,
      });

      // Generate email link (fallback for mailto)
      const emailLink = orderService.generateOrderEmail(order, artworkTitle);

      res.status(201).json({ 
        order,
        emailLink,
        message: "Order request created successfully" 
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Subdomain-specific routing
  app.use((req, res, next) => {
    const subdomain = (req as any).subdomain;

    // API subdomain - serve API documentation or health check
    if (subdomain === "api") {
      if (req.path === "/" || req.path === "/health") {
        return res.json({
          name: "Zaanse Plankjes Maffia API",
          version: "1.0.0",
          endpoints: {
            health: "/health",
            artworks: "/api/artworks",
            orders: "/api/orders",
            newsletter: "/api/newsletter",
            contact: "/api/contact",
            admin: "/api/admin",
          },
        });
      }
    }

    // Admin subdomain - redirect to admin panel
    if (subdomain === "admin") {
      if (req.path === "/" || req.path.startsWith("/admin")) {
        const staticPath =
          process.env.NODE_ENV === "production"
            ? path.resolve(__dirname, "public")
            : path.resolve(__dirname, "..", "dist", "public");
        return res.sendFile(path.join(staticPath, "index.html"));
      }
    }

    // Staging subdomain - serve staging version
    if (subdomain === "staging") {
      // Use staging database if configured
      if (process.env.STAGING_DB_NAME) {
        // Could switch database connection here
      }
    }

    next();
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.NODE_ENV === "production" 
    ? (process.env.PORT || 3000)
    : (process.env.PORT || 3001);

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
