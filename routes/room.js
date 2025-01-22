import { Router } from "express";
import upload from "../middlewares/upload.js";
import roomController from "../controllers/roomController.js";
import {ensureAuthenticate, checkUserLevel} from "../auth/protect.js";

const router = new Router();

router.get('/filterRoom', ensureAuthenticate ,roomController.filterRoom);

router.get('/addRoom', ensureAuthenticate, checkUserLevel('admin') ,roomController.addRoomView);
router.post('/addRoom', ensureAuthenticate, checkUserLevel('admin'), upload.single('roomImage'), roomController.addRoom);

router.get('/detailRoom/:id',ensureAuthenticate, roomController.roomDetailView);



export default router;