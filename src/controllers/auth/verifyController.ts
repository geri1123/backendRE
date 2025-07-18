import { Request, Response } from 'express';
import pool from '../../config/db.js';
import { EmailService } from '../../services/emailServices/verificationEmailservice.js';

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const token = req.query.token;

    // Validate token
    if (typeof token !== 'string') {
       res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
      return
    }

    // Check if token is valid and not expired
    const [rows] = await pool.query(
      `SELECT id, role, email, first_name, agency_id 
       FROM users 
       WHERE verification_token = ? 
         AND verification_token_expires > NOW()`,
      [token]
    );

    const user = (rows as any[])[0];
    if (!user) {
       res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
      return
    }

    // Determine status to update
    const emailVerified = 1;
    const statusToUpdate = user.role === 'agent' ? 'pending' : 'active';

    // Update user email_verified and status
    await pool.query(
      `UPDATE users 
       SET email_verified = ?, status = ?, 
           verification_token = NULL, verification_token_expires = NULL 
       WHERE id = ?`,
      [emailVerified, statusToUpdate, user.id]
    );

    // If user is agency owner, activate agency
    if (user.role === 'agency_owner' && user.agency_id) {
      await pool.query(
        `UPDATE agencies SET status = 'active' WHERE id = ?`,
        [user.agency_id]
      );
    }

    // Send email based on role
    if (user.role === 'agent') {
      await EmailService.sendPendingApprovalEmail(user.email, user.first_name);
    } else {
      await EmailService.sendWelcomeEmail(user.email, user.first_name);
    }

    // Final response
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
