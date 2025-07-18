export interface UsernameValidationResult {
  valid: boolean;
  errors?: { [key: string]: string };
}

export function validateUsernameInput(username: string): UsernameValidationResult {
  const errors: { [key: string]: string } = {};

  if (!username || username.trim() === "") {
    errors.username = "Username is required";
  } else {
    username = username.trim();
    if (username.length < 4) {
      errors.username = "Username must be at least 4 characters long";
    }
    if (/\s/.test(username)) {
      errors.username = "Username cannot contain spaces";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
