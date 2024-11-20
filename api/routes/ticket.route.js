import express from "express";
import { createTicket, deleteTicket, getAllTicket, getTicket, getTicketUser, testTicket, updateTicket } from "../controllers/ticket.controller.js";



const router = express.Router();

router.get("/test",testTicket);
router.post("/create_ticket",createTicket);
router.get("/get_all_tickets",getAllTicket );
router.get("/get_a_ticket/:id", getTicket);
router.get("/get_a_ticket_user/:id", getTicketUser);
router.put("/update_ticket/:id", updateTicket);
router.delete("/delete_ticket/:id",deleteTicket);



export default router;