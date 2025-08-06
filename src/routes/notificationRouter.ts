import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getNotifications } from "../controllers/notifications/notifications";
const router= Router();

router.use('/getNotifications/:lang' , verifyToken , getNotifications);

export default router;