import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

import staffRoute from "./routes/staff.route.js"

import requestRoute from "./routes/request.route.js";
import productRoute from "./routes/product.route.js";
import roomRoute from'./routes/room.route.js';
import orderRoute from "./routes/order.route.js";
import bookingRoute from'./routes/booking.route.js';
import announcementRoute from "./routes/announcement.route.js";
import ticketRoute from "./routes/ticket.route.js";
import supplierRoute from "./routes/supplier.route.js";




dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});


const app = express();
app.use(cookieParser());
app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is Running on Port 3000");
});

const corsOptions = {
    origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/staff",staffRoute)
app.use("/api/request",requestRoute);
app.use("/api/products", productRoute);
app.use("/api/rooms", roomRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/order", orderRoute);
app.use("/api/announcement", announcementRoute);
app.use("/api/ticket",ticketRoute);
app.use("/api/supplier", supplierRoute);


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    });
})
