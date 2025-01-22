import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amountPaid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'empty'
    },
    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
})

export default Payment;