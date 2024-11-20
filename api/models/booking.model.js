import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for better referencing
      ref: "User", // Reference to the User model
      required: true,
    },
    email: {
      type: String,
      ref: "User", // Reference to the Room model
      required: true,
    },
    username: {
      type:String,
      ref: "User", // Reference to the User model
    },
    bookingstatus: {
      type:Boolean,
      ref: "Room", // Reference to the Room model
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    roomtype: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    roomno: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
   
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
