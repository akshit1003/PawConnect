import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoutes.js"

dotenv.config();

const mongoURL = process.env.mongoURL;
const app = express();
const port = 3000;


app.use(bodyParser.json());

app.use('/user', userRoute)

mongoose.connect(process.env.mongoURL) 
    .then(() => {
        console.log("Connected to mongoDB")
        app.listen(port, () => {
            console.log(`Server running at port: ${port}`)
        })
    }) .catch((error) => {
        console.log(error)
    })



