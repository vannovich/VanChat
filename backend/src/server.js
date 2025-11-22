import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/index.routes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use("/api", routes);

app.listen(port, () => console.log(`Running on port ${port}`));
