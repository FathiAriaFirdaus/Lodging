// models/Reservation.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    checkInDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    checkOutDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "check-in", "check-out"),
        defaultValue: "pending",
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    // Kolom tambahan yang mungkin diperlukan
});

export default Reservation;
