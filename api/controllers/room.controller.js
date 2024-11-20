import Rooms from "../models/room.model.js";
import { errorHandler } from "../utils/error.js";

export const addRoom = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to add rooms'));
    }

    const { roomtype, furnished, price, gender, roomno } = req.body;

    // Ensure all required fields are provided
    if (!roomtype || typeof furnished === 'undefined' || !price || !gender || !roomno) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    // Create the room without the slug first to get the ObjectId
    const newRoom = new Rooms({
      ...req.body,
      userId: req.user.id,
    });

    const savedRoom = await newRoom.save();

    // Generate the slug using roomno and ObjectId
    const slug = `${roomno.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')}-${savedRoom._id}`;

    // Update the room with the newly created slug
    savedRoom.slug = slug;
    const updatedRoom = await savedRoom.save();

    res.status(201).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const { slug, searchTerm, page = 1, limit = 9, roomtype, priceRange } = req.query;
    const queryOptions = {};

    if (slug) {
      queryOptions.slug = slug;
    }

    if (searchTerm) {
      queryOptions.roomtype = { $regex: searchTerm, $options: 'i' };
    }

    if (roomtype) {
      queryOptions.roomtype = roomtype;
    }
    
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      queryOptions.price = { $gte: minPrice, $lte: maxPrice };
    }

    
    const totalrooms = await Rooms.countDocuments({...queryOptions});
    

    // Count of single rooms
    const totalSingleRooms = await Rooms.countDocuments({ ...queryOptions, roomtype: 'Single' });

    // Count of double rooms
    const totalDoubleRooms = await Rooms.countDocuments({ ...queryOptions, roomtype: 'Double' });

    // Add more counts as needed for other room types
     const totalTripleRooms = await Rooms.countDocuments({ ...queryOptions, roomtype: 'Triple' });
     
    

    const rooms = await Rooms.find(queryOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      rooms,
      totalrooms,
      totalSingleRooms,
      totalDoubleRooms,
      totalTripleRooms,
      totalPages: Math.ceil(totalrooms / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update room details'));
    }
    if (!req.body.roomno || !req.body.roomtype || !req.body.gender ) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const updatedRoom = await Rooms.findByIdAndUpdate(
      req.params.roomId,
      {
        $set: {
          roomno: req.body.roomno,
          roomtype: req.body.roomtype,
          gender: req.body.gender,
          furnished: req.body.furnished,
          price: req.body.price,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete Room'));
    }
    await Rooms.findByIdAndDelete(req.params.roomId);
    res.status(200).json('The Room has been deleted');
  } catch (error) {
    next(error);
  }
};


