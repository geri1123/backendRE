///utils/config.ts

import dotenv from 'dotenv';
dotenv.config();
export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ,
    name: process.env.DB_NAME ,
  },
  server: {
    port: Number(process.env.PORT) || 8080,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  email: {
    emailuser: process.env.EMAIL_USER || '',
    emailpass: process.env.EMAIL_PASS || '',
    emailservice:process.env.EMAIL_SERVICE || 'gmail',
  },
  secret: {
    jwtSecret: process.env.JWT_SECRET ,
  },
    client: {
    baseUrl: process.env.CLIENT_BASE_URL || 'http://localhost:3000',
    
  },
  nodeenv: process.env.NODE_ENV || 'development'
};
// export const config = {
//   db: {
//     host: process.env.DB_HOST || 'localhost',
//     port: Number(process.env.DB_PORT) || 3306,
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'geri1996',
//     name: process.env.DB_NAME || 'realestate_db',
//   },
//   server: {
//     port: Number(process.env.PORT) || 8080,
//     corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   },
//   secret:{
//     jwtSecret: process.env.JWT_SECRET
//   },
//    client: {
//     baseUrl:'http://localhost:3000',
//   },
//   email:{
//     emailuser:process.env.EMAIL_USER || '',
//     emailpass:process.env.EMAIL_PASS || '',
//   },
// };