import Payment from "../models/Payment.js";
import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";

const pay = async (req, res) => {
    const reservationId = req.params.reservationId;
    const amountPaid = req.body.amountPaid;
    const paymentMethod = req.body.paymentMethod;
    const roomId = req.body.roomId;

    console.log(req.body);

    try{
        const payment = await Payment.create({
            reservationId,
            amountPaid,
            paymentMethod,
        })

        const reservation = await Reservation.update(
            {status: req.user && req.user.level === 'receptionist' ? 'check-in' : 'confirmed',},
            {where: {id: reservationId}}
        );

        if (req.user.level === 'receptionist') {
            await Room.update(
                { roomAvailable: false },
                { where: { id: roomId } }
            );
            res.redirect('/homeReceptionist');
        } else {
            res.redirect('/reservation');
        }
        
    }
    catch(err){
        res.status(500);
    }
}

export default {pay};