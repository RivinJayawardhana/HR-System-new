import express from "express";
import { createAnnouncement, deleteAnnouncement, getAllAnnouncements, getAnnouncement, testAnnouncement, updateAnnouncement } from "../controllers/announcement.controller.js";


const router = express.Router();

router.get("/test",testAnnouncement);
router.post("/create_announcement",createAnnouncement);
router.get("/get_all_announcements", getAllAnnouncements);
router.get("/get_a_announcement/:id", getAnnouncement);
router.put("/update_announcement/:id", updateAnnouncement);
router.delete("/delete_announcement/:id",deleteAnnouncement);



export default router;