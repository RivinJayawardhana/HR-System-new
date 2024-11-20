import express from 'express';
import { addRoom,getRooms,deleteRoom ,updateRoom} from '../controllers/room.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/add',verifyToken,addRoom);
router.delete('/delete/:roomId/:userId',verifyToken,deleteRoom);
router.put('/update/:roomId/:userId',verifyToken,updateRoom);
router.get('/getrooms',getRooms);


export default router;