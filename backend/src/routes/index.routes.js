import express from "express";

import authRoute from './auth.route.js';
import messageRout from "./message.route.js"

const router = express.Router();

router.use("/auth", authRoute);
router.use("/message", messageRout);

export default router;
