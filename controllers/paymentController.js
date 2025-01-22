import Payment from "../models/Payment.js";
import Reservation from "../models/Reservation.js";

const pay = async (req, res) => {
    const reservationId = req.params.reservationId;
    const amountPaid = req.body.amountPaid;
    const paymentMethod = req.body.paymentMethod;

    try{
        const payment = await Payment.create({
            reservationId,
            amountPaid,
            paymentMethod,
        })

        const reservation = await Reservation.update(
            {status: 'confirmed'},
            {where: {id: reservationId}}
        )

        res.redirect('/reservation');
    }
    catch(err){}
}

export default {pay};