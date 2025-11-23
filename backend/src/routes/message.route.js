import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();
// Middleware

// The middleware execute in order - so requests get rate-limited first, then authenticated.
// This is actually more effiecient since unauthenticated requests get blocked by rate limiting
//before hitting the middleware.
router.use(arcjetProtection, protectRoute);

// Routes for messages
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
