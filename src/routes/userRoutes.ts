import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadSingleImage } from '../middlewares/uploadFile.js';
import { updateProfileImage } from '../controllers/user/updateprofile.js';
import { changeUsername } from '../controllers/user/updateUsername.js';
import { updateAboutMe } from '../controllers/user/updateAboutMe.js';
import { changePassword } from '../controllers/user/updatePassword.js';
import { updatePhone } from '../controllers/user/updatePhone.js';
import { updateFnameLname } from '../controllers/user/updateFnameLname.js';
const router = express.Router();
router.use(verifyToken);
router.patch('/update-profileImg',  uploadSingleImage, updateProfileImage);
router.patch('/update-username' ,  changeUsername); 
router.patch('/update-password' ,  changePassword);
router.patch('/update-aboutMe' ,  updateAboutMe );
router.patch('/update-phone' ,updatePhone );
router.patch('/update-FnmLnm' ,updateFnameLname )
export default router;