import express from "express";
import * as sessionService from "../services/sessionService.js";

/**
 * Middleware to require admin authentication
 */
export const requireAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const sessionId = req.headers.authorization?.replace("Bearer ", "") || (req as any).cookies?.sessionId;
  
  if (!sessionId || !(await sessionService.verifySession(sessionId))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  next();
};

