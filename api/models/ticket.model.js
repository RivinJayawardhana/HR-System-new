import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema({
    userid:{
        type: String,
    },
    studentId: {
        type: String,
        required: true,
        trim: true
    },
    studentName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    issueType:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    reply:{
        type: String,
        default: "No reply yet",
    },
    status:{
        type: Boolean,
        default : false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps : true});

const Ticket = mongoose.model("ticket", ticketSchema);
export default Ticket;