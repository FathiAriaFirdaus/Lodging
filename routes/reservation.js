import { Router } from "express";
import reservationController from "../controllers/reservationController.js";
import {ensureAuthenticate, checkUserLevel} from "../auth/protect.js";

const router = new Router();

router.get('/reservation', ensureAuthenticate, reservationController.reservationView);
router.get('/detailReservation/:id', ensureAuthenticate, reservationController.reservationDetailView);
router.get('/continueToPayment/:id', ensureAuthenticate, reservationController.reservationPaymentView);
router.post('/addReservation/:roomId', ensureAuthenticate, reservationController.addReservation);
router.delete('/deleteReservation/:id', ensureAuthenticate, reservationController.deleteReservation);
router.get('/manageCheckInView', ensureAuthenticate, checkUserLevel('receptionist'), reservationController.manageCheckInView);
router.get('/manageCheckOutView', ensureAuthenticate, checkUserLevel('receptionist'), reservationController.manageCheckOutView);
router.post('/validateCheckIn/:id', ensureAuthenticate, checkUserLevel('receptionist'), reservationController.validateCheckIn);
router.post('/validateCheckOut/:id', ensureAuthenticate, checkUserLevel('receptionist'), reservationController.validateCheckOut);

export default router;