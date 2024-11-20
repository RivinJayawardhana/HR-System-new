import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,

      lowercase: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    additionalDetails: {
      type: String,
      default : "No any additional details"
    },
    status: {
      type: Boolean,
      default: false,
    },
    commentsUser: {
      type: String,
      default : "No any comments yet"
    },
    commentsAdmin: {
      type: String,
      default : "No any comments yet"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const cleanRequest = mongoose.model("CleanRequest", requestSchema);
export default cleanRequest;
