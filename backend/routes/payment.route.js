import express from "express";
import { protectRoute } from "../middleware/auth.route.js";
import { createCheckoutSession, checkoutSuccess } from "../controllers/payment.controller.js";



const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;