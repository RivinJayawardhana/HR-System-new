import express from 'express';
import {addBooking, deleteBooking, getBookings, updateBookingStatus} from '../controllers/booking.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/addbooking',verifyToken,addBooking);
router.delete('/deletebooking/:bookingId/:userId',verifyToken,deleteBooking);
router.get('/getbookings',getBookings);
router.put('/updatestatus/:bookingId', verifyToken, updateBookingStatus);

export default router;