import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { initDatabase } from "./lib/database.js";
import adminRoutes from "./routes/admin.js";
import apiRoutes from "./routes/api.js";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine base directory - in production (bundled), __dirname is dist/, so go up one level
// In development, __dirname is server/, so we need to handle both cases
const BASE_DIR = process.env.NODE_ENV === "production" 
  ? path.resolve(__dirname, "..")
  : __dirname;


// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

async function startServer() {

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

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Public API routes
  app.use("/api", apiRoutes);

  // Admin routes
  app.use("/api/admin", adminRoutes);

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
