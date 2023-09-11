import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import bodyParser from "body-parser";
import db from "./dbConfig/dbconfig.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


const connection = async() => {
    try {
        await db.authenticate();
        console.log(`Database is Connected`);        
    } catch (error) {
        console.log(`Error while connecting Database`, error);
    };
};

const update = async() => {
    try {
        await db.sync();
        console.log(`All Models are synchronized`);
    } catch (error) {
        console.log(`Error while synchronizing Models`, error);
    };
};
connection();
update();
var jsonParser = bodyParser.json();


// ROUTES 
app.use(`/api/chat`, jsonParser, chatRoutes);
app.use(`/api/user`, jsonParser, userRoutes);
app.use(`/api/messages`, jsonParser, messageRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening at port ${process.env.PORT}`);
});