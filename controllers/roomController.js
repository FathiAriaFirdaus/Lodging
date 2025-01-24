import Room from "../models/Room.js";
import Service from "../models/Service.js";
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
        res.redirect('/manageRoom');
    }
    catch (err) {
        console.error(err);
        res.status(500);
    }
}

const manageRoomView = async (req, res) => {
    try{
        const room = await Room.findAll()    
        res.render("manageRoom.ejs", {roomData: room});
    }
    catch (err) {
        res.status(500)
    }
}

const editRoomView = async (req, res) => {
    const roomId = req.params.id;
    console.log("ROOM EDIT VIEW: ENDPOINT HIT")

    try{
        const room = await Room.findByPk(roomId); 
        res.render("editRoom.ejs", {roomSingleData: room});
    }
    catch (err) {
        res.status(500)
    }
}

const editRoom = async (req, res) => {
    const roomId = req.params.id;
    const roomName = req.body.roomName;
    const roomType = req.body.roomType;
    const roomCapacity = req.body.roomCapacity;
    const roomPrice = req.body.roomPrice;
    const roomDescription = req.body.roomDescription;

    try{
        const room = await Room.update(
            {roomName: roomName, roomType: roomType, roomCapacity: roomCapacity, roomPrice: roomPrice, roomDescription: roomDescription},
            {where: {id : roomId}}
        )

        res.redirect("/manageRoom");
    }
    catch (err) {
        res.status(500).send(err);
    }
}

const deleteRoom = async (req, res) => {
    console.log("DELETE ROOM: ENDPOINT HIT");
    const roomId = req.params.id;

    try{
        const room = await Room.destroy({
            where: {id: roomId}
        })

        res.redirect('/manageRoom');
    }
    catch (err) {
        res.status(500).send(err);
    }
}

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

        filters.roomAvailable = true;

        const roomData = await Room.findAll({
            where: filters
        });

        if (req.user.level === 'receptionist'){
            res.render('homeLoginReceptionist.ejs', {roomData: roomData});
        } else {
            res.render('homeLogin.ejs', {roomData: roomData});
        }
        
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

        const service = await Service.findAll()

        if (roomSingleData) {
            res.render("detailRoom.ejs", {
                roomSingleData: roomSingleData,
                service: service})
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
    manageRoomView,
    editRoomView,
    editRoom,
    deleteRoom
};