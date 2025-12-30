import express from "express";
import rateLimit from "express-rate-limit";
import * as artworkService from "../services/artworkService.js";
import * as orderService from "../services/orderService.js";
import * as newsletterService from "../services/newsletterService.js";
import * as contactService from "../services/contactService.js";
import * as emailService from "../services/emailService.js";

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit form submissions to 5 per 15 minutes
  message: "Too many form submissions, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

// Artworks endpoints (public)
router.get("/artworks", async (_req, res) => {
  try {
    const artworks = await artworkService.getArtworks();
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/artworks/:id", async (req, res) => {
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

// Newsletter subscription endpoint
router.post("/newsletter", formLimiter, async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ 
        error: "Email is required and must be a string" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }

    const subscription = await newsletterService.subscribeToNewsletter(email, name);

    try {
      await emailService.sendNewsletterConfirmation(email, name);
    } catch (emailError) {
      console.warn("Failed to send newsletter confirmation email:", emailError);
    }

    res.status(200).json({ 
      message: "Successfully subscribed to newsletter",
      email: subscription.email,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    
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
router.post("/contact", formLimiter, async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }

    await contactService.createContactSubmission(name, email, message, subject);

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

// Order endpoints
router.post("/orders", formLimiter, async (req, res) => {
  try {
    const { artworkId, orderType, options, inspiration, contactInfo } = req.body;

    if (!orderType || !contactInfo || !contactInfo.name || !contactInfo.email) {
      return res.status(400).json({ 
        error: "Order type and contact info (name, email) are required" 
      });
    }

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

    let artworkTitle: string | undefined;
    if (artworkId) {
      const artwork = await artworkService.getArtworkById(artworkId);
      artworkTitle = artwork?.title;
    }

    await emailService.sendOrderNotification({
      id: order.id,
      artworkId: order.artworkId,
      orderType: order.orderType,
      contactInfo: order.contactInfo,
      artworkTitle,
    });

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

export default router;

