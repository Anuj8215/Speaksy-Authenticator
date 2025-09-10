# Speaksy Authenticator

A secure TOTP-based authentication application similar to Google Authenticator, built with React and Node.js.

## Pro### Security Considerations

- All secret keys are stored in the database using encryption
- JWT tokens are used for API authentication with proper validation
- HTTPS should be used in production for secure data transmission
- Regular security audits are recommended
- Server-side validation of all input data
- Protection against common web vulnerabilities:
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - SQL/NoSQL Injection
  - Brute Force Attacks (via rate limiting)
- Proper error handling that doesn't expose sensitive information
- Secure HTTP headers implementationverview

Speaksy Authenticator provides a secure solution for two-factor authentication using Time-based One-Time Passwords (TOTP). This application allows users to manage authentication tokens for various services through a clean, modern interface.

The application consists of a React-based frontend and a Node.js/Express backend, with MongoDB as the database. It implements the industry-standard TOTP algorithm (RFC 6238) for generating secure, time-based authentication codes.

## Features

- **User Authentication**: 
  - Secure signup and login system
  - JWT-based session management
  - Password hashing with bcrypt

- **Service Management**: 
  - Add services manually by entering a secret key
  - Add services via OTP authentication URL
  - View all registered services in a clean dashboard
  - Delete services when no longer needed
  - Search and filter services

- **TOTP Generation**: 
  - Generate and display 6-digit TOTP codes
  - Visual countdown timer for code expiration
  - Automatic refresh of codes every 30 seconds
  - RFC 6238 compliant implementation

- **Security**: 
  - Encrypted storage of secret keys
  - JWT-based authentication with proper expiration
  - Protection against unauthorized access
  - API rate limiting
  - Input validation and sanitization

## Tech Stack

### Backend

- **Node.js & Express**: Server framework
- **MongoDB with Mongoose**: Database for storing user data and services
- **JWT**: Authentication tokens
- **Speakeasy**: TOTP generation library
- **Bcrypt**: Password hashing

### Frontend

- **React**: UI library
- **React Router**: Navigation
- **Axios**: API requests
- **React Circular Progressbar**: Visual countdown for TOTP codes
- **Modern CSS**: Clean, responsive design with animations

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB database (local or MongoDB Atlas)
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anuj8215/Speaksy-Authenticator.git
   cd Speaksy-Auth
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```
   PORT=4000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=7d
   TOTP_ISSUER=SpeaksyAuth
   TOTP_DIGITS=6
   TOTP_STEP=30
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev  # Uses nodemon for development
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```

3. Access the application at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/user` - Get current user info (requires auth)

### Services Management
- `POST /api/auth/register-service` - Register a new service manually
- `POST /api/auth/register-service-scan` - Register a service via OTP URL
- `GET /api/auth/services` - Get all services with current codes
- `DELETE /api/auth/services/:id` - Delete a service

## Usage Guide

1. **Registration/Login**:
   - Create a new account or log in with existing credentials
   
2. **Adding a Service**:
   - **Manual Entry**: Enter service name, secret key, and optionally the service provider name
   - **OTP URL Entry**: Paste the otpauth:// URL from another service
   
3. **Dashboard**:
   - View all your TOTP codes in one place
   - Watch the countdown timer for each code
   - Codes automatically refresh every 30 seconds

4. **Security**:
   - Your secret keys are stored securely in the database
   - Never share your TOTP codes with anyone

## Security Considerations

- All secret keys are stored in the database using encryption
- JWT tokens are used for API authentication
- HTTPS should be used in production for secure data transmission
- Regular security audits are recommended

## Development

### Project Structure
```
speaksy-auth/
├── backend/             # Node.js backend
│   ├── middleware/      # Auth middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
└── frontend/            # React frontend
    ├── public/          # Static files
    └── src/             # Source files
        ├── components/  # React components
        ├── services/    # API services
        └── utils/       # Utility functions
```

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

### Code Style and Standards
- Follow the existing code style and formatting
- Write meaningful commit messages
- Include comments for complex logic
- Write tests for new features
- Ensure all tests pass before submitting pull requests
- Keep dependencies updated and minimal

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [RFC 6238](https://tools.ietf.org/html/rfc6238) - TOTP standard
- [Speakeasy](https://github.com/speakeasyjs/speakeasy) - TOTP library
- [OWASP](https://owasp.org/) - Security best practices
- [React](https://reactjs.org/) - UI library
- [Express](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database

## Future Enhancements

- QR code scanning for adding services
- Dark mode toggle
- Import/export functionality for services
- Biometric authentication
- Browser extension
- Offline mode support
- Backup and recovery options
