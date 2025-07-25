import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { updateAgencyInfo } from '../controllers/agency/update/updateWebsite.js';
import { requireAgencyOwner } from '../middlewares/roleAuth.js';
import { AgentRequestController } from '../controllers/agency/agentsRequests.js';
const router = express.Router();

router.patch('/update-website', verifyToken, requireAgencyOwner,updateAgencyInfo);
router.get('/getAgentsRequest' , verifyToken , requireAgencyOwner , AgentRequestController.getRequests)
export default router;