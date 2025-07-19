// import { UserRepository } from "../repositories/UserRepository";
// import { AgencyRepository } from "../repositories/AgencyRepository";
// import { RegistrationRequestRepository } from "../repositories/RegistrationRequestRepository";
// import { RegistrationData } from "../types/auth";
// import { validateRegistrationInput } from "./authValidator";
// export async function validateRegistrationInputAsync(data: RegistrationData): Promise<Record<string, string>> {

//  const errors = validateRegistrationInput(data);
//   // === DB checks below ===
//   if (data.email && await UserRepository.emailExists(data.email)) {
//     errors.email = 'Email already exists.';
//   }

//   if (data.username && await UserRepository.usernameExists(data.username)) {
//     errors.username = 'Username already exists.';
//   }

//   if (data.role === 'agency_owner') {
//     if (data.agency_name && await AgencyRepository.agencyNameExist(data.agency_name)) {
//       errors.agency_name = 'Agency name already exists.';
//     }

//     if (data.license_number && await AgencyRepository.licenseExists(data.license_number)) {
//       errors.license_number = 'License number already exists.';
//     }
//   }

//   if (data.role === 'agent') {
//     const agency = data.public_code ? await AgencyRepository.findByPublicCode(data.public_code) : null;
//     if (!agency) {
//       errors.public_code = 'Invalid public code.';
//     }

//     if (data.id_card_number && await RegistrationRequestRepository.idCardExists(data.id_card_number)) {
//       errors.id_card_number = 'ID card number already submitted for registration.';
//     }
//   }

//   return errors;
// }
import { UserRepository } from "../repositories/UserRepository";
import { AgencyRepository } from "../repositories/AgencyRepository";
import { RegistrationRequestRepository } from "../repositories/RegistrationRequestRepository";
import { RegistrationData } from "../types/auth";
import { validateRegistrationInput } from "./authValidator";
import { ValidationError } from "../errors/BaseError";

export async function validateRegistrationInputAsync(data: RegistrationData): Promise<void> {
  const errors = validateRegistrationInput(data);

  if (data.email && await UserRepository.emailExists(data.email)) {
    errors.email = 'Email already exists.';
  }

  if (data.username && await UserRepository.usernameExists(data.username)) {
    errors.username = 'Username already exists.';
  }

  if (data.role === 'agency_owner') {
    if (data.agency_name && await AgencyRepository.agencyNameExist(data.agency_name)) {
      errors.agency_name = 'Agency name already exists.';
    }

    if (data.license_number && await AgencyRepository.licenseExists(data.license_number)) {
      errors.license_number = 'License number already exists.';
    }
  }

  if (data.role === 'agent') {
    const agency = data.public_code ? await AgencyRepository.findByPublicCode(data.public_code) : null;
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