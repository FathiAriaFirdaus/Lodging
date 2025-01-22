import { Sequelize } from "sequelize"
import env from "dotenv";

env.config();

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD, {
        host: process.env.PG_HOST,
        dialect: 'postgres'
    });

export default sequelize;