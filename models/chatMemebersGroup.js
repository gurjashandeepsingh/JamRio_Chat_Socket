import {
    Sequelize,
    DataTypes,
    Model
} from "sequelize";
import db from "../dbConfig/dbconfig.js";

const chatMemberGroupModel = db.define(`chatMemberGroup`, {
    chatId: {
        type: DataTypes.STRING
        // type: DataTypes.INTEGER,
        // references:{
        //     model: `chat`,
        //     key: `id`
        // }
    },
    userId: {
        type: DataTypes.STRING
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
}, {
    timestamps: true
});

export default chatMemberGroupModel;