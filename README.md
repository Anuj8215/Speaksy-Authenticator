# Speaksy Authenticator

A Google Authenticator-like TOTP authentication application built with React and Node.js.

## Features

- User authentication (register/login)
- Add services manually by entering a secret key
- Add services via OTP authentication URL
- Generate and display TOTP codes with countdown timer
- Delete services

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Speakeasy for TOTP generation
- QRCode for QR code handling

### Frontend

- React
- React Router for navigation
- Axios for API requests
- React Circular Progressbar for countdown visualization

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB database (local or MongoDB Atlas)

### Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/speaksy-authenticator.git
cd speaksy-authenticator
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Set up environment variables

   **Backend**: Copy `.env.example` to `.env` in the backend directory and update with your values:

   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   TOTP_ISSUER=SpeaksyAuth
   JWT_SECRET=your_secure_random_string
   ```

   **Frontend**: Copy `.env.example` to `.env` in the frontend directory:

   ```
   REACT_APP_API_URL=http://localhost:4000/api/auth
   REACT_APP_TOTP_REFRESH_INTERVAL=1000
   ```

4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server

```bash
cd backend
npm run dev  # Uses nodemon for development
# or
npm start    # Uses node for production
```

2. Start the frontend application

```bash
cd frontend
npm start
```

3. Access the application at http://localhost:3000

## Usage

1. Register a new account or log in with existing credentials
2. Add a service:
   - **Manual Entry**: Enter service name, secret key, and optionally the service provider name
   - **Enter OTP URL**: Paste the otpauth:// URL from another service
3. View your TOTP codes on the dashboard
4. Codes automatically refresh every 30 seconds with a countdown timer

## Security Considerations

1. Environment Variables
   - The `.env` files contain sensitive information and are excluded from version control via `.gitignore`
   - Use strong, randomly generated values for the JWT_SECRET
   - Keep your MongoDB connection string private
2. JWT Authentication

   - JWT tokens are used for securing API endpoints
   - Tokens expire after 7 days by default

3. Password Security
   - Passwords are hashed using bcrypt before storage
   - The frontend never stores plaintext passwords

- All secret keys are stored in the database using encryption
- JWT tokens are used for API authentication
- HTTPS should be used in production for secure data transmission
