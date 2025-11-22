import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import routes from "./routes/index.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.resolve();

// Routes
app.use("/api", routes);

//Make ready for deployment
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}


app.listen(port, () => console.log(`Running on port ${port}`));
