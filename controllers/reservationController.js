import { Sequelize } from "sequelize";
import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import { User } from "../relation.js";
import models from "../models/index.js";

const reservationView = async(req, res) => {
    console.log('reservationView ENDPOINT 1 HIT');
    try {
        console.log('reservationView ENDPOINT 2 HIT')
        const userId = req.user.id;

        console.log(userId);
        console.log('reservationView ENDPOINT 3 HIT')

        const reservationData = await Reservation.findAll({
            where: { userId: userId },
            include: {
                model: Room,
                attributes: ['id', 'roomName', 'roomType', 'roomPrice', 'roomImage'],
            },
            order: [
                [Sequelize.literal("CASE WHEN status = 'pending' THEN 0 ELSE 1 END"), 'ASC'], // CASE ditutup dengan END
                ['id', 'DESC'], // Urutkan berdasarkan ID secara menurun
            ],
        });
        
        console.log('reservationView ENDPOINT 4 HIT')
        console.log(reservationData);
        res.render("reservation.ejs", {reservationData: reservationData});
    }
    catch(err) {
        res.status(500).send('An error occured')
    }
}

const reservationDetailView = async(req, res) => {
    const reservationId = req.params.id;

    try{
        const reservationSingleData = await Reservation.findByPk(reservationId, {
            include: {
                model: Room,
                attributes: ['id', 'roomName', 'roomType', 'roomPrice', 'roomImage']
            },
        })

        res.render("detailReservation.ejs", {reservationSingleData: reservationSingleData});
    }
    catch (err) {
        res.status(500).send('An error occured when fetching reservation detail.')
    }
}

const addReservation = async(req, res) => {
    const {checkInDate, checkOutDate, totalPrice} = req.body;
    const roomId = req.params.roomId;
    const userId = req.user.id;

    try{
        const room = await Room.findByPk(roomId)
        if (!room) {
            res.status(404);
        }

        const reservation = await Reservation.create({
            userId,
            roomId,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        res.redirect('/reservation');

    }
    catch(err){
        res.status(500).sent("An error occured")
    }
}

const reservationPaymentView = async(req, res) => {
    const reservationId = req.params.id;

    try{
        const reservationSingleData = await Reservation.findByPk(reservationId, {
            include: [{
                model: Room,
                attributes: ['roomName']
            },
            {
                model: User,
                attributes: ['name']
            }]
        })

        res.render("processPayment.ejs", {reservationSingleData: reservationSingleData})
    }
    catch(err){
        res.status(500);
    }
}

const deleteReservation = async (req, res) => {
    const reservationId = req.params.id;

    try{
        const reservation = await Reservation.destroy({
            where: {
                id: reservationId
            }
        })

        res.redirect("/reservation")
    }
    catch(err){
        res.status(500)
    }
}

const manageCheckInView = async (req, res) => {
    try {
        const reservation = await Reservation.findAll({
            where: {
                status: 'confirmed'
            },
            include: [{
                model: Room,
                attributes: ['id', 'roomName', 'roomImage']
            },
            {
                model: User,
                attributes: ['name']
            }
            ]
        });

        res.render("manageCheckInView.ejs", {reservationData: reservation});
    }
    catch(err){
        res.status(500)
    }
}

const manageCheckOutView = async (req, res) => {
    try {
        const reservation = await Reservation.findAll({
            where: {
                status: 'check-in'
            },
            include: [{
                model: Room,
                attributes: ['id', 'roomName', 'roomImage']
            },
            {
                model: User,
                attributes: ['name']
            }
            ]
        });

        res.render("manageCheckOutView.ejs", {reservationData: reservation});
    }
    catch(err){
        res.status(500)
    }
}

const validateCheckIn = async (req, res) => {
    const reservationId = req.params.id;
    const roomId = req.body.roomId

    try{
        const reservation = await Reservation.update(
            {status: 'check-in'},
            {where: {id: reservationId}}
        )

        const room = await Room.update(
            {roomAvailable: false},
            {where: {id: roomId}}
        )
        res.redirect('/manageCheckInView')
    }
    catch(err){
        res.status(500)
    }
}

const validateCheckOut = async (req, res) => {
    const reservationId = req.params.id;
    const roomId = req.body.roomId;

    try{
        const reservation = await Reservation.update(
            {status: 'check-out'},
            {where: {id: reservationId}}
        )

        const room = await Room.update(
            {roomAvailable: true},
            {where: {id: roomId}}
        )

        res.redirect('/manageCheckOutView')
    }
    catch(err){
        res.status(500)
    }
}

export default {
    reservationView,
    reservationDetailView,
    reservationPaymentView,
    addReservation,
    deleteReservation,
    manageCheckInView,
    manageCheckOutView,
    validateCheckIn,
    validateCheckOut
};