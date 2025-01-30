import { Sequelize } from "sequelize";
import Reservation from "../models/Reservation.js";
import ReservationService from "../models/ReservationService.js";
import Service from "../models/Service.js";
import Room from "../models/Room.js";
import { User } from "../relation.js";

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
        // console.log(reservationData);
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
            include: [{
                model: Room,
                attributes: ['id', 'roomName', 'roomType', 'roomPrice', 'roomImage']
            },
            {
                model: Service,
                attributes: ['id', 'serviceName', 'servicePrice'],
                through: []
            }]
        })

        res.render("detailReservation.ejs", {reservationSingleData: reservationSingleData});
    }
    catch (err) {
        res.status(500).send('An error occured when fetching reservation detail.')
    }
}

const addReservation = async(req, res) => {
    const {checkInDate, checkOutDate, totalPrice, services} = req.body;
    const roomId = req.params.roomId;
    const servicesArray = services ? services.split(',').map(serviceId => parseInt(serviceId, 10)) : [];
    console.log(req.body);
    console.log(servicesArray);

    try{
        const room = await Room.findByPk(roomId)
        if (!room) {
            res.status(404);
        }

        console.log("SUCCESS BEFORE CREATE")
        const reservation = await Reservation.create({
            userId: req.user && req.user.level === 'user' ? req.user.id : null,
            roomId,
            checkInDate,
            checkOutDate,
            totalPrice,
        })
        console.log("SUCCESS AFTER CREATE")

        if (servicesArray.length > 0) {
            console.log("SERVICE ARRAY HIT");
        
            // Gunakan for loop untuk iterasi servicesArray
            for (let i = 0; i < servicesArray.length; i++) {
                const serviceId = servicesArray[i];
        
                // Pastikan serviceId valid
                if (serviceId) {
                    try {
                        // Membuat record untuk tiap service menggunakan create
                        await ReservationService.create({
                            reservationId: reservation.id,
                            serviceId: parseInt(serviceId, 10), // Pastikan serviceId adalah integer
                        });

                        console.log("QUERY SUCCESS")
                    } catch (error) {
                        console.error(`Error inserting service ${serviceId} into ReservationService:`, error);
                        // Jika ingin berhenti di error pertama, bisa menggunakan return atau continue
                        // res.status(500).send("Error occurred while adding service");
                        continue; // Lanjutkan ke service berikutnya meskipun ada error
                    }
                } else {
                    console.log(`Skipping invalid serviceId at index ${i}: ${serviceId}`);
                }
            }
        }

        if(req.user.level === 'receptionist') {
            res.redirect(`/continueToPayment/${reservation.id}`)
        } else {
            res.redirect('/reservation');
        }
    }
    catch(err){
        res.status(500).send("An error occured")
    }
}

const reservationPaymentView = async(req, res) => {
    const reservationId = req.params.id;

    try{
        const reservationSingleData = await Reservation.findByPk(reservationId, {
            include: [{
                model: Room,
                attributes: ['id', 'roomName']
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
        const reservationService = await ReservationService.destroy({
            where: {
                reservationId: reservationId
            }
        })

        const deleteReservation = await Reservation.destroy({
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