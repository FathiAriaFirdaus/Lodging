import { Router } from "express";
import paymentController from "../controllers/paymentController.js";
import {ensureAuthenticate, checkUserLevel} from "../auth/protect.js";

const router = new Router();

router.post('/pay/:reservationId', ensureAuthenticate, paymentController.pay);

export default router;