import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../dbConfig/dbconfig.js";

const chatMemberModel = db.define(`chatMember`,{
    chatId: {
        type: DataTypes.INTEGER.UNSIGNED
        // type: DataTypes.INTEGER,
        // references: {
        //     model: `chat`,
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
        defaultValue: Sequelize.UUID4,
        allowNull: false,
        primaryKey: true
    }
},
    {timestamps: true}
);

export default chatMemberModel;