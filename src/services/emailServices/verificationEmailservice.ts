import { transporter } from '../../utils/email/transporter.js';
import { config } from '../../utils/config.js';
import { verificationEmailTemplate } from '../../utils/email/templates/verificationEmail.js';
import { welcomeEmailTemplate } from '../../utils/email/templates/welcomeEmail.js';
export class EmailService {
  static async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const verificationLink = `http://localhost:8080/api/auth/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `Real Estate Platform <${config.email.emailuser}>`,
      to: email,
      subject: 'Verify Your Account',
      html:verificationEmailTemplate(name , verificationLink), 
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const mailOptions = {
      from: `Real Estate Platform <${config.email.emailuser}>`,
      to: email,
      subject: 'Welcome to Real Estate Platform',
      html: welcomeEmailTemplate(name)
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  static async sendPendingApprovalEmail(email: string, name: string): Promise<boolean> {
    const mailOptions = {
      from: `Real Estate Platform <${config.email.emailuser}>`,
      to: email,
      subject: 'Registration Pending Approval',
      html: `
        <h2>Hello ${name}!</h2>
        <p>Your registration has been submitted and is pending approval.</p>
        <p>We will review your application and notify you once it's approved.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending pending approval email:', error);
      return false;
    }
  }
}