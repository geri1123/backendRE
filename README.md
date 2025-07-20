# RealEstate Backend API

A backend REST API for a real estate platform supporting user registration, role-based access (users, agents, agency owners), profile management (including profile images), secure authentication, and file uploads. Built with Node.js, Express, and MySQL.

---

## Features

- User registration and login with email verification
- Role-based access: users, agents, agency owners
- Profile image upload and management (local storage or AWS S3)
- Update profile info: about me, phone, website, username, password
- File upload support for images and documents with validation
- Secure JWT authentication with token verification middleware
- Multilingual support (planned/future)
- Proper error handling with custom error classes

---

## Technologies Used

- Node.js & Express.js
- TypeScript
- MySQL with connection pooling
- Multer for file uploads (local or AWS S3)
- AWS SDK (optional, for S3 image/document storage)
- dotenv for environment variable management
- Custom error handling classes
- JSON Web Tokens (JWT) for authentication