import { Request, Response , NextFunction } from 'express';
import { AuthService } from '../../services/AuthServices/AuthService.js';

import { LoginRequest } from "../../types/auth.js"; 
import { RegistrationData } from '../../types/auth.js';
import { ValidationError } from '../../errors/BaseError.js';
import { loginValidation } from '../../validators/users/loginValidation.js';
import { handleZodError } from '../../validators/zodErrorFormated.js';
import { registrationSchema } from '../../validators/users/authValidatorAsync.js';

//register

export async function register(
  req: Request<{}, {}, RegistrationData>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await registrationSchema.parseAsync(req.body);
    const userId = await AuthService.registerUserByRole(req.body);
    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userId,
    });
  } catch (err) {
    handleZodError(err, next);
  }
}
//login
export async function loginUser(req: Request<{}, {}, LoginRequest>, res: Response , next:NextFunction): Promise<void> {
  try {
    const { identifier, password } = loginValidation.parse(req.body);
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
  } catch (err) {
      return handleZodError(err, next)
  }
}
