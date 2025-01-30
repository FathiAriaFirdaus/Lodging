import { Router } from "express";
import { upload, uploadToCloudinary }  from "../middlewares/upload.js";
import roomController from "../controllers/roomController.js";
import {ensureAuthenticate, checkUserLevel} from "../auth/protect.js";

const router = new Router();

router.get('/filterRoom', ensureAuthenticate ,roomController.filterRoom);

router.get('/addRoom', ensureAuthenticate, checkUserLevel('admin') ,roomController.addRoomView);
router.post('/addRoom', ensureAuthenticate, checkUserLevel('admin'), upload.single('roomImage'), uploadToCloudinary, roomController.addRoom);

router.get('/manageRoom', ensureAuthenticate, checkUserLevel('admin'), roomController.manageRoomView);
router.get('/editRoom/:id', ensureAuthenticate, checkUserLevel('admin'), roomController.editRoomView);
router.post('/editRoom/:id', ensureAuthenticate, checkUserLevel('admin'), roomController.editRoom);

router.delete('/deleteRoom/:id', ensureAuthenticate, checkUserLevel('admin'), roomController.deleteRoom);

router.get('/detailRoom/:id',ensureAuthenticate, roomController.roomDetailView);

export default router;