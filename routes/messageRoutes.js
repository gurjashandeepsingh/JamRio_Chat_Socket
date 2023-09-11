import express from "express";
const router = express.Router();
import { allMessages, sendMessage } from "../controllers/messageController.js";

// Send a Messagpe 
router.route(`/sendMessage`).post(sendMessage);

// Fetch All Mesages 
router.route(`/allMessages`).post(allMessages);

export default router;