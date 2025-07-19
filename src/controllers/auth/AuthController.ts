import { Request, Response , NextFunction } from 'express';
import { AuthService } from '../../services/AuthServices/AuthService';
import { validateRegistrationInputAsync } from '../../validators/authValidatorAsync';
import { LoginRequest } from "../../types/auth.js"; 

import { ValidationError } from '../../errors/BaseError';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    await validateRegistrationInputAsync(req.body);
    const result = await AuthService.registerUserByRole(req.body);
    res.status(201).json({ message: "Registration successful. Please verify your email.", userId: result });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({ errors: error.errors });
    } else {
      res.status(error.statusCode || 500).json({ message: error.message || "Something went wrong." });
    }
  }
}

export async function loginUser(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
  const { identifier, password } = req.body;
      if (!identifier || !password) {
    // Throw a custom ValidationError here
    throw new ValidationError({
      identifier: !identifier ? 'Email is required' : '',
      password: !password ? 'Password is required' : '',
    });
  }
  // if (!identifier || !password) {
  //   res.status(400).json({ message: 'Email and password are required.' });
  //   return;
  // }

  try {
    
    const authService = new AuthService();
    const { user, token } = await authService.login(identifier, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
      path: '/',
    });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error: any) {
    res.status(error.statusCode || 401).json({ message: error.message || 'Login failed' });
  }
}
// export async function register(req:Request , res:Response):Promise<void>{
//      const errors = await validateRegistrationInputAsync(req.body);
//   if (Object.keys(errors).length > 0) {
//      res.status(400).json({ errors });
//      return
//   }

//       try {
//         const result=await AuthService.registerUserByRole(req.body);
//         res.status(201).json({message:"Registration successful. Please verify your email." , userId:result});
//       } catch(error:any){
//         res.status(400).json({error:error.message});
//       }
// }

// export async function loginUser (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void>  {
//   const { identifier, password } = req.body;

//   if (!identifier || !password) {
//     res.status(400).json({ message: 'Email and password are required.' });
//     return;
//   }

//   const authService = new AuthService();

//   try {
//     const { user, token } = await authService.login(identifier, password);

//     res.clearCookie('token', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       path: '/',
//     });

//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: false,
//       maxAge: 86400000,
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       path: '/',
//     });

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//       },
//     });
//   } catch (error: any) {
//     res.status(401).json({ message: error.message || 'Login failed' });
//   }
// };