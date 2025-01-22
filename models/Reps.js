import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Reps = sequelize.define('Reps', {
    month: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalReservations: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Reps;