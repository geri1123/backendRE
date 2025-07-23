import { Request, Response , NextFunction } from 'express';
import { AuthService } from '../../services/AuthServices/AuthService.js';
import { validateRegistrationInputAsync } from '../../validators/authValidatorAsync.js';
import { LoginRequest } from "../../types/auth.js"; 
import { RegistrationData } from '../../types/auth.js';
import { ValidationError } from '../../errors/BaseError.js';

export async function register(
  req: Request <{}, {}, RegistrationData>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await validateRegistrationInputAsync(req.body);
    const result = await AuthService.registerUserByRole(req.body);
    res.status(201).json({ message: "Registration successful. Please verify your email.", userId: result });
  } catch (error) {
    next(error);
  }
}
export async function loginUser(req: Request<{}, {}, LoginRequest>, res: Response , next:NextFunction): Promise<void> {
  const { identifier, password } = req.body;
      if (!identifier || !password) {
    // Throw a custom ValidationError here
    throw new ValidationError({
      identifier: !identifier ? 'Email is required' : '',
      password: !password ? 'Password is required' : '',
    });
  }
  

  try {
    
    const authService = new AuthService();
    const { user, token } = await authService.login(identifier, password);

    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
      path: '/',
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
      next(error);
  }
}
