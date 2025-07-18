import { Router } from 'express';
import { register } from '../controllers/auth/AuthController';
import { loginUser } from '../controllers/auth/AuthController';
// import { verifyEmail } from '../controllers/auth/verifyController';

const router = Router();

router.post('/register', register); 
router.post('login', loginUser )

export default router;