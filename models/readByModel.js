import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../dbConfig/dbconfig.js";

const readByModel = db.define(`readBy`, {
    messageId: {
        type: DataTypes.INTEGER.UNSIGNED
        // type: DataTypes.INTEGER,
        // references: {
        //     model: `message`,
        //     key: `id`
        // }
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED
        // type: DataTypes.INTEGER,
        // references: {
        //     model: `user`,
        //     key: `id`
        // }
    },
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    }
}, 
    {timestamps: true}
);

export default readByModel;