import express from "express";
const router = express.Router();
import {userRegistration, userLogin} from "../controllers/userControllers.js";


// 1. User Login 
router.route(`/login`).post(userLogin);

// 2. User Registration 
router.route(`/registration`).post(userRegistration);

export default router;