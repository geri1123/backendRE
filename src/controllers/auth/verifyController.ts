// import { Request, Response } from 'express';

// import { UserRepository } from '../../repositories/UserRepository';


// export const verifyEmail = async (req: Request, res: Response) => {
//   try {
//     const { token } = req.query;
    
//     if (!token || typeof token !== 'string') {
//       return res.status(400).json({
//         success: false,
//         message: 'Verification token is required'
//       });
//     }
    
//     const result = await UserRepository.verifyEmail(token);
//     res.json({
//       success: true,
//       message: 'Email verified successfully',
//       user: result
//     });
//   } catch (error: any) {
//     console.error('Email verification error:', error);
    
//     const statusCode = error.statusCode || 500;
//     const message = error.message || 'Internal server error';
    
//     res.status(statusCode).json({
//       success: false,
//       message: message
//     });
//   }
// };