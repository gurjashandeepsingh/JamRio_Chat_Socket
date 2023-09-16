import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../dbConfig/dbconfig.js";

const messageModel = db.define("message", {
    sender: {
        type: DataTypes.STRING,
        allowNull: false,
        // type: DataTypes.INTEGER,
        // references: {
        //     model: "user",
        //     key: "id"
        // }
    },
    // receiver: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     // type: DataTypes.INTEGER,
    //     // references: {
    //     //     model: "user",
    //     //     key: "id"
    //     // }
    // },
    /**Ask what will be the content and content type for different types of data i.e image, doc */
    content: {
        type: DataTypes.STRING
    },
    contentType: {
        type: DataTypes.STRING
    },
    chatId: {
        type: DataTypes.STRING,
        allowNull: false,
        // type: DataTypes.INTEGER,
        // references: {
        //     model: `chats`,
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

export default messageModel;