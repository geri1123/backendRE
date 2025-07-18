import { config } from "../../utils/config";
import { changePasswordTemplate } from "../../utils/email/templates/changePassEmail";
import { transporter } from "../../utils/email/transporter";
export const sendPaasemail = async (email: string, name: string) => {
  const mailOptions = {
    from: `Real Estate Platform <${config.email.emailuser}>`,
    to: email,
    subject: 'Welcome to Real Estate Platform',
    html: changePasswordTemplate(name),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};