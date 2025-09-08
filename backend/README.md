# Speaksy Authenticator Backend

A secure TOTP-based authenticator backend similar to Google Authenticator.

## Features

- User authentication (signup/login) with JWT
- Register services manually or via QR code scan
- Generate TOTP codes for registered services
- Verify TOTP codes
- Manage (add/remove) services

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   Make sure the `.env` file has the following variables:

   ```
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/speaksy_auth
   JWT_SECRET=your_secure_jwt_secret
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user

  - Body: `{ "email": "user@example.com", "password": "securepassword" }`
  - Returns: JWT token and user info

- **POST /api/auth/login** - Login

  - Body: `{ "email": "user@example.com", "password": "securepassword" }`
  - Returns: JWT token and user info

- **GET /api/auth/user** - Get current user info (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Returns: User info

### Services Management

- **POST /api/auth/register-service** - Register a new service manually (requires auth)

  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "Service Name", "secret": "BASE32SECRET", "issuer": "Optional Issuer" }`

- **POST /api/auth/register-service-scan** - Register a service via QR code (requires auth)

  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "otpauth_url": "otpauth://totp/Example:user@example.com?secret=BASE32SECRET&issuer=Example" }`

- **GET /api/auth/services** - Get all services with current codes (requires auth)

  - Headers: `Authorization: Bearer <token>`
  - Returns: List of services with TOTP codes

- **DELETE /api/auth/services/:id** - Delete a service (requires auth)

  - Headers: `Authorization: Bearer <token>`
  - Params: Service ID

- **POST /api/auth/verify** - Verify a TOTP code (requires auth)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "serviceId": "service_id", "token": "123456" }`
  - Returns: Verification result

## Flow

1. User registers/logs in
2. User adds services either by:
   - Manual entry of secret key
   - Scanning QR code from a service provider
3. Backend generates TOTP codes for each service
4. User can verify TOTP codes against registered services
