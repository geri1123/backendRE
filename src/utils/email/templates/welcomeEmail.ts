
// File: backend/src/utils/email/templates/welcomeEmail.ts
export const welcomeEmailTemplate = (name: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to Real Estate Platform, ${name}!</h2>
    <p>Your account has been successfully verified and you can now login.</p>
    <p>Thank you for joining our platform!</p>
  </div>
`;