import { Sequelize, DataTypes, Model } from "sequelize";
import db from "../dbConfig/dbconfig.js";

const userModel = db.define("user", {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    /**Ask what will be the type of this email field */
    email: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // picture: {
    //     type: DataTypes.STRING
    // },
    /** Ask about datatype and default value */
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false 
    }
},
    {timestamps: true}
);

export default userModel;