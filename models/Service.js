import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    servicePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    serviceDescription: {
        type: DataTypes.STRING,
    },
})

export default Service;