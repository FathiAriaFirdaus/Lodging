import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ReservationService = sequelize.define('ReservationService', {
    reservationId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Reservations', // Menghubungkan dengan tabel Reservation
            key: 'id',
        },
        allowNull: false,
    },
    serviceId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Services',
            key: 'id'
        }
    }
}, {
    tableName: "ReservationServices",
})

export default ReservationService;