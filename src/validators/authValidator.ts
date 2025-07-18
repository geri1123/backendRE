import { RegistrationData } from "../types/auth";

export function validateRegistrationInput(data: RegistrationData) {
  const errors: Record<string, string> = {};

  // Username: must be min 4 chars, no spaces
  if (!data.username || data.username.trim().length < 4) {
    errors.username = 'Username must be at least 4 characters long.';
  } else if (/\s/.test(data.username)) {
    errors.username = 'Username must not contain spaces.';
  }

  // Email: basic format check
  if (!data.email) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Email is not valid.';
  }

  // Password: min 6 chars, no spaces
  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  } else if (/\s/.test(data.password)) {
    errors.password = 'Password must not contain spaces.';
  }

  // Password confirmation
  if (data.password !== data.repeatPassword) {
    errors.repeatPassword = 'Passwords do not match.';
  }

  // First and last name
  if (!data.first_name?.trim()) {
    errors.first_name = 'First name is required.';
  }

  if (!data.last_name?.trim()) {
    errors.last_name = 'Last name is required.';
  }
if (!data.terms_accepted) {
  errors.terms_accepted = 'Please accept the terms and conditions.';
}
  // Role
  if (!data.role) {
    errors.role = 'Role is required.';
  } else if (!['user', 'agency_owner', 'agent'].includes(data.role)) {
    errors.role = 'Invalid role selected.';
  }

  // Agency owner fields
  if (data.role === 'agency_owner') {
    if (!data.agency_name?.trim()) {
      errors.agency_name = 'Agency name is required.';
    }
    if (!data.license_number?.trim()) {
      errors.license_number = 'License number is required.';
    }
    if (!data.address?.trim()) {
      errors.address = 'Address is required.';
    }
  }

  // Agent fields
  if (data.role === 'agent') {
    if (!data.public_code?.trim()) {
      errors.public_code = 'Public code is required.';
    }
    if (!data.id_card_number?.trim()) {
      errors.id_card_number = 'ID card number is required.';
    }
    // if (!data.agency_name?.trim()) {
    //   errors.agency_name = 'Agency name is required.';
    // }
  }

  return errors;
}