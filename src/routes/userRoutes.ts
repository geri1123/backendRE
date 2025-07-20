import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadSingleImage } from '../middlewares/uploadFile.js';
import { updateProfileImage } from '../controllers/user/updateprofile.js';
import { changeUsername } from '../controllers/user/updateUsername.js';
import { updateAboutMe } from '../controllers/user/updateAboutMe.js';
import { changePassword } from '../controllers/user/updatePassword.js';
import { updatePhone } from '../controllers/user/updatePhone.js';
const router = express.Router();

router.patch('/update-profileImg', verifyToken, uploadSingleImage, updateProfileImage);
router.patch('/update-username' , verifyToken , changeUsername); 
router.patch('/update-password' , verifyToken , changePassword);
router.patch('/update-aboutMe' , verifyToken ,updateAboutMe );
router.patch('/update-phone' , verifyToken ,updatePhone );
export default router;