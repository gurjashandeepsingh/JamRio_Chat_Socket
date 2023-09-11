import { Sequelize, Model, DataTypes } from "sequelize";
import db from "../dbConfig/dbconfig.js";

const chatModel = db.define(`chat`, {
    chatName: {
        type: DataTypes.STRING,
    },
    isGroupChat: {
        type: DataTypes.BOOLEAN
    },
    groupAdmin: {
        type: DataTypes.STRING
    },
    /**Ask how will this display picture actually work ? */
    displayPicture: {
        type: DataTypes.STRING
    },
    latestMessage: {
        type: DataTypes.STRING
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

export default chatModel;