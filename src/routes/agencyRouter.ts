import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { updateAgencyInfo } from '../controllers/agency/update/updateWebsite.js';
import { requireAgencyOwner } from '../middlewares/roleAuth.js';
import { getAgentsRequests } from '../controllers/agency/get/getAgentsRequests.js';
const router = express.Router();

router.patch('/update-website', verifyToken, requireAgencyOwner,updateAgencyInfo);
router.get('getAgencyInfo' , verifyToken , requireAgencyOwner , getAgentsRequests)
export default router;