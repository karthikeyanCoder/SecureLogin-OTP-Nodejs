# SecureLogin-OTP-Nodejs

## Project Overview

SecureLogin-OTP-Nodejs is a robust authentication system built using Node.js. It incorporates OTP-based authentication for secure user verification, ensuring a high level of security for user logins. This project utilizes technologies like Node.js, Express, MongoDB, bcrypt, and JWT for user authentication and nodemailer for sending OTPs via email.

The key features of this project include:

- User signup with OTP-based email verification.
- Secure password storage using bcrypt.
- JWT-based authentication for secure API access.
- OTP management with automatic expiry.
- Seamless email integration using Nodemailer and Google OAuth2.

      ### .env ###

  MONGO_URL=your_mongo_db_connection_string
  JWT_SECRET=your_jwt_secret
  
  SERVER_URL=your_server_url

### Running the Application

    npm run dev or     node server.js
