import { Router } from 'express';
import { register } from '../controllers/auth/AuthController';
import { loginUser } from '../controllers/auth/AuthController';
import { resendVerificationEmail } from '../controllers/auth/verifyController';
import { loginRateLimiter } from '../middlewares/ratelimit';
import  {verifyEmail}  from '../controllers/auth/verifyController';
const router = Router();

router.post('/register', register); 
router.post('/login', loginRateLimiter, loginUser  )
router.get('/verify-email', verifyEmail); 
router.post('/resend-verification', resendVerificationEmail);
export default router;