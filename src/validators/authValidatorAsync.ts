
import { UserQueries } from "../repositories/user/UserQueries.js";
import { AgencyQueries } from "../repositories/agency/index.js";
import { RegistrationRequestRepository } from "../repositories/registrationRequest/RegistrationRequest.js";
import { RegistrationData } from "../types/auth.js";
import { validateRegistrationInput } from "./authValidator.js";
import { ValidationError } from "../errors/BaseError.js";

export async function validateRegistrationInputAsync(data: RegistrationData): Promise<void> {
  const errors = validateRegistrationInput(data);

  if (data.email && await UserQueries.emailExists(data.email)) {
    errors.email = 'Email already exists.';
  }

  if (data.username && await UserQueries.usernameExists(data.username)) {
    errors.username = 'Username already exists.';
  }

  if (data.role === 'agency_owner') {
    if (data.agency_name && await AgencyQueries.agencyNameExist(data.agency_name)) {
      errors.agency_name = 'Agency name already exists.';
    }

    if (data.license_number && await AgencyQueries.licenseExists(data.license_number)) {
      errors.license_number = 'License number already exists.';
    }
  }

  if (data.role === 'agent') {
    const agency = data.public_code ? await AgencyQueries.findByPublicCode(data.public_code) : null;
    if (!agency) {
      errors.public_code = 'Invalid public code.';
    }

    if (data.id_card_number && await RegistrationRequestRepository.idCardExists(data.id_card_number)) {
      errors.id_card_number = 'ID card number already submitted.';
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }
}