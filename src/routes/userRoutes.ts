import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadSingleImage } from '../middlewares/uploadFile.js';
import { updateProfileImage } from '../controllers/user/changeprofile.js';
import { changeUsername } from '../controllers/user/changeUsername.js';

import { changePassword } from '../controllers/user/changePassword.js';
const router = express.Router();

router.patch('/update-profileImg', verifyToken, uploadSingleImage, updateProfileImage);
router.patch('/update-username' , verifyToken , changeUsername); 
router.patch('/update-password' , verifyToken , changePassword)
export default router;