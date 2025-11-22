import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import routes from "./routes/index.routes.js";
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

//Make ready for deployment
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(distPath));
  // Handle unmatched API routes with JSON 404 before catch-all
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Running on port ${port}`);
  connectDB();
});
