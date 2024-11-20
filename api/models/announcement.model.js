import mongoose from "mongoose";


const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps : true});

const Announcement = mongoose.model("announcement", announcementSchema);
export default Announcement;