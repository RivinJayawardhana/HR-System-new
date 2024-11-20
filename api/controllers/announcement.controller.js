import Announcement from "../models/announcement.model.js";
import { errorHandler } from "../utils/error.js";

// Test route
export const testAnnouncement = (req, res) => {
    res.json({ msg: "Announcement works" });
};

// Create a new announcement
export const createAnnouncement = async (req, res, next) => {
    const { title, category, description} = req.body;

    // Ensure required fields are provided
    if (!title || !category || !description) {
        return next(errorHandler(400, 'Please provide all required fields: title, category, and description'));
    }

    // Create a new announcement instance
    const newAnnouncement = new Announcement({
        title,
        category,
        description
    });

    try {
        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json(savedAnnouncement); // Successfully created announcement
    } catch (error) {
        next(error);  // Pass error to middleware
    }
};

// Get all announcements
export const getAllAnnouncements = async (req, res, next) => {
    try {
        const announcements = await Announcement.find();
        res.json(announcements);  // Return all announcements
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a specific announcement by ID
export const getAnnouncement = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        const announcement = await Announcement.findById(announcementId);

        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.json(announcement);  // Return the announcement
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update an announcement by ID
export const updateAnnouncement = async (req, res, next) => {
    const announcementId = req.params.id;
    const { title, category, description, reply, attachments } = req.body;

    const updatedFields = {
        title,
        category,
        description,
        reply,
        attachments
    };

    try {
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            announcementId,
            updatedFields,
            { new: true }  // Return the updated document
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.status(200).json(updatedAnnouncement);  // Return the updated announcement
    } catch (error) {
        next(error);
    }
};

// Delete an announcement by ID
export const deleteAnnouncement = async (req, res, next) => {
    const announcementId = req.params.id;

    try {
        const deletedAnnouncement = await Announcement.findByIdAndDelete(announcementId);

        if (!deletedAnnouncement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        res.status(200).json('The announcement has been deleted');
    } catch (error) {
        next(error);
    }
};
