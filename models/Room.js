import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Room = sequelize.define("Room", {
    roomName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roomType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roomCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roomPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roomDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    roomAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    roomImage: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default Room;