
// export interface ValidationErrors {
//   [key: string]: string;
// }

// export class ValidationError extends Error {
//   public errors: ValidationErrors;
  
//   constructor(errors: ValidationErrors) {
//     super('Validation failed');
//     this.errors = errors;
//   }
// }

// export const validateBaseRegistration = (data: BaseRegistration): ValidationErrors => {
//   const errors: ValidationErrors = {};

//   if (!data.username?.trim()) errors.username = "Username is required";
//   if (!data.email?.trim()) errors.email = "Email is required";
//   if (!data.password?.trim()) errors.password = "Password is required";
//   if (!data.first_name?.trim()) errors.first_name = "First name is required";
//   if (!data.last_name?.trim()) errors.last_name = "Last name is required";

//   // Email format validation
//   if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//     errors.email = "Invalid email format";
//   }

//   // Password strength validation
//   if (data.password && data.password.length < 6) {
//     errors.password = "Password must be at least 6 characters long";
//   }

//   return errors;
// };

// export const validateAgencyOwnerRegistration = (data: AgencyOwnerRegistration): ValidationErrors => {
//   const errors = validateBaseRegistration(data);

//   if (!data.agency_name?.trim()) errors.agency_name = "Agency name is required";
//   if (!data.license_number?.trim()) errors.license_number = "License number is required";
//   if (!data.agency_email?.trim()) errors.agency_email = "Agency email is required";

//   // Agency email format validation
//   if (data.agency_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.agency_email)) {
//     errors.agency_email = "Invalid agency email format";
//   }

//   return errors;
// };

// export const validateAgentRegistration = (data: AgentRegistration): ValidationErrors => {
//   const errors = validateBaseRegistration(data);

//   if (!data.agency_public_code?.trim()) errors.agency_public_code = "Agency public code is required";
//   if (!data.id_card_number?.trim()) errors.id_card_number = "ID card number is required";

//   return errors;
// };