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
   Create a `.env` file in the backend directory with the following variables:

```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
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

- All secret keys are stored in the database using encryption
- JWT tokens are used for API authentication
- HTTPS should be used in production for secure data transmission
