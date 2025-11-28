import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    // 🟢 Skip strict bot checks in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("[Arcjet] Dev mode: skipping bot/spoof checks");
      return next();
    }

    const decision = await aj.protect(req);

    // Handle outright denials
    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Rate limit exceeded. Please try again later.",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      }

      return res.status(403).json({
        message: "Access denied by security policy.",
      });
    }

    // Detect spoofed bots ONLY in production
    if (decision.results.some(isSpoofedBot)) {
      console.warn("[Arcjet] Spoofed bot detected:", req.ip);
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected",
      });
    }

    next();
  } catch (error) {
    console.error("[Arcjet] Protection Error:", error.message);

    // Allow pass-through to avoid locking users out due to middleware errors
    return next();
  }
};
