RealEstate Backend API
A backend REST API for a real estate platform supporting user registration, role-based access (users, agents, agency owners), profile management (including profile images), secure authentication, and file uploads. Built with Node.js, Express, and MySQL.

Features
User registration and login with email verification

Role-based access: users, agents, agency owners

Profile image upload and management (local storage or AWS S3)

Update profile info: about me, phone, website, username, password

File upload support for images and documents with validation

Secure JWT authentication with token verification middleware

Agent and agency management with approval workflows

Email notifications on key events (verification, approval, rejection)

Proper error handling with custom error classes

Multilingual support (planned/future)

Technologies Used
Node.js & Express.js

TypeScript for static typing and code quality

MySQL database with Prisma ORM for schema and queries

Multer for file uploads (local storage or AWS S3 integration)

AWS SDK (optional, for S3 storage)

dotenv for environment configuration

JSON Web Tokens (JWT) for authentication and authorization

Custom error handling classes for consistent error responses