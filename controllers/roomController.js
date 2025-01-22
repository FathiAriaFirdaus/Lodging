import Room from "../models/Room.js";
import { Op } from "sequelize";

const addRoomView = async (req, res) => {
    res.render('addRoom.ejs');
}

const addRoom = async (req, res) => {

    const roomName = req.body.roomName;
    const roomType = req.body.roomType;
    const roomCapacity = req.body.roomCapacity;
    const roomPrice = req.body.roomPrice;
    const roomDescription = req.body.roomDescription;
    const roomImage = req.file ? req.file.filename : null;

    try {
        const room = await Room.create({
            roomName,
            roomType,
            roomCapacity,
            roomPrice,
            roomDescription,
            roomAvailable: true,
            roomImage,
        })

        res.status(201)
        res.redirect('/')
    }
    catch (err) {
        console.error(err);
        res.status(500);
    }
}

const editRoomView = async (req, res) => {}
const editRoom = async (req, res) => {}
const deleteRoom = async (req, res) => {}

const filterRoom = async (req, res) => {
    try{
        const roomMinPrice = req.query.roomMinPrice;
        const roomMaxPrice = req.query.roomMaxPrice;
        const roomCapacity = req.query.roomCapacity;
        const roomType = req.query.roomType;

        const filters = {};
        if (roomMinPrice && roomMaxPrice){
            filters.roomPrice = {[Op.between]: [roomMinPrice, roomMaxPrice]}
        } else if (roomMinPrice) {
            filters.roomPrice = {[Op.gte]: roomMinPrice}
        } else if (roomMaxPrice) {
            filters.roomPrice = {[Op.lte]: roomMaxPrice}
        }

        if (roomCapacity) filters.roomCapacity = roomCapacity;
        if (roomType) filters.roomType = roomType;

        const roomData = await Room.findAll({
            where: filters
        });

        res.render('homeLogin.ejs', {roomData: roomData});
    }
    catch (err) {
        res.status(500).send('An error occured');
    }
}

const roomDetailView = async (req, res) => {
    console.log("roomDetailView ENDPOINT HIT");
    const roomId = req.params.id;

    try{
        const roomSingleData = await Room.findByPk(roomId);
        console.log(roomSingleData);

        if (roomSingleData) {
            res.render("detailRoom.ejs", {roomSingleData: roomSingleData})
        } else {
            res.status(404).send('Thing you are looking for doenst exist')
        }
    }
    catch(err){
        res.status(500).send('An error occured')
    }
}

export default {
    addRoom,
    addRoomView, 
    filterRoom,
    roomDetailView,
};