import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { uploadSingleImage } from '../middlewares/uploadFile';
import { updateProfileImage } from '../controllers/user/changeprofile';
import { changeUsername } from '../controllers/user/changeUsername';
import { changePassword } from '../controllers/user/changePassword';
import { loginRateLimiter } from '../middlewares/ratelimit';
const router = express.Router();

router.post('/update-profileImg', verifyToken, uploadSingleImage, updateProfileImage);
router.patch('/update-username' , verifyToken , changeUsername); 
router.patch('/update-password' , verifyToken , changePassword)
export default router;