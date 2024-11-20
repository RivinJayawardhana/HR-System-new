import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Booking from '../models/booking.model.js';
import Rooms from '../models/room.model.js';
dotenv.config();

export const addBooking = async (req, res, next) => {
  try {
    const { userId, roomno } = req.body;

    // Check if the booking already exists for the same user and room
    const existingBooking = await Booking.findOne({ userId, roomno });
    if (existingBooking) {
      return res.status(409).json({ message: "ALREADY BOOKING REQUEST ADDED" });
    }

    const newbooking= new Booking({
      ...req.body,
      userId: req.user.id,
    });

    const savedBooking = await newbooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
    try {
      const { searchTerm, page = 1, limit = 9, username } = req.query;
      const queryOptions = {};
  
      if (searchTerm) {
        queryOptions.username = { $regex: searchTerm, $options: 'i' };
      }
  
      if (username) {
        queryOptions.username = username;
      }
  
      const totalBookingRequests = await Booking.countDocuments(queryOptions);
      const bookings = await Booking.find(queryOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit));
  
      res.status(200).json({
        bookings,
        totalBookingRequests,
        totalPages: Math.ceil(totalBookingRequests / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      next(error);
    }
  };

  
export const deleteBooking = async (req, res, next) => {
  try {
    if ( req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete Room'));
    }
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.status(200).json('The Booking has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { bookingstatus } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.bookingstatus = bookingstatus;
    //booking.updatedAt = Date.now(); // Update the updatedAt field

    await Rooms.findOneAndUpdate({ roomno: booking.roomno }, { bookingstatus: bookingstatus });

    // If the status is now true (approved), send email
    if (bookingstatus) {
      await sendApprovalEmail(booking.email, booking.username, booking.roomno);
    }

    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};


const sendApprovalEmail = async (email, username, roomno) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Your Booking Request has been Approved!',
    text: `Hello ${username},\n\nYour booking request for Room No: ${roomno} has been approved. Please contact us for further details.\n\nThank you!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service, this example is for Gmail
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email from the .env file
    pass: process.env.EMAIL_PASSWORD, // Your app-specific password from the .env file
  },
});

  