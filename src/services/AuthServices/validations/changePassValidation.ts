export function validateChangePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): { valid: boolean; message?: string } {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { valid: false, message: "All password fields are required." };
  }
  if (newPassword.length < 8) {
    return { valid: false, message: "New password must be at least 8 characters long." };
  }
  if (/\s/.test(newPassword)) {
    return { valid: false, message: "New password must not contain spaces." };
  }
  if (newPassword !== confirmPassword) {
    return { valid: false, message: "New password and confirmation do not match." };
  }
  return { valid: true };
}