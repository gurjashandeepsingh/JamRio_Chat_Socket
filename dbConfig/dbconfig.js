import dotenv from "dotenv"
dotenv.config(
    {silent: true}
);
import { Sequelize } from "sequelize";

const db = new Sequelize(`chat_test`, process.env.DB_USERNAME || "", process.env.DB_PASSWORD || "", {
    host: process.env.HOST || "",
    dialect: `mysql`
});

export default db;