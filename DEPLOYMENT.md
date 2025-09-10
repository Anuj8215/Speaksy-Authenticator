# Vercel Deployment Guide for Speaksy Authenticator

This guide explains how to deploy the Speaksy Authenticator project to Vercel.

## Backend Deployment Architecture

**Your backend will run as Vercel Serverless Functions:**

- Each API endpoint becomes a separate serverless function
- Functions are automatically deployed and scaled by Vercel
- No traditional server maintenance required
- Built-in HTTPS, CDN, and global edge network

## Deployment Options

### Option 1: Full-Stack Vercel Deployment (Recommended)

This approach deploys both frontend and backend to Vercel using serverless functions.

#### Step 1: Prepare Environment Variables

In your Vercel dashboard, add these environment variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
TOTP_ISSUER=SpeaksyAuth
TOTP_DIGITS=6
TOTP_STEP=30
NODE_ENV=production
```

#### Step 2: Deploy to Vercel

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application

#### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all required variables listed above
4. Redeploy if needed

### Option 2: Frontend Only on Vercel + External Backend

If you prefer to deploy the backend elsewhere:

#### Backend Deployment Options:
- **Heroku**: Easy deployment with add-ons
- **Railway**: Modern platform with great MongoDB integration  
- **Render**: Simple deployment with free tier
- **DigitalOcean App Platform**: Scalable with managed databases

#### Frontend Configuration:
Update `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.com/api
```

## File Structure After Deployment

```
/
├── api/                     # Serverless functions (your backend)
│   ├── health.js           # Health check endpoint
│   └── auth/               # Authentication endpoints
│       ├── login.js        # POST /api/auth/login
│       ├── register.js     # POST /api/auth/register
│       ├── user.js         # GET /api/auth/user
│       ├── services.js     # GET /api/auth/services
│       ├── register-service.js
│       ├── register-service-scan.js
│       ├── verify.js       # POST /api/auth/verify
│       └── services/
│           └── [id].js     # DELETE /api/auth/services/:id
├── lib/                    # Shared utilities for serverless functions
│   ├── auth.js            # Authentication middleware
│   ├── cors.js            # CORS handling
│   ├── db.js              # Database connection
│   └── models.js          # MongoDB models
├── frontend/               # React application
└── vercel.json            # Vercel configuration
```

## How Your Backend Works on Vercel

### Serverless Functions
- Each file in `/api` becomes a serverless function endpoint
- Functions are stateless and automatically scaled
- Cold starts are minimal for most requests
- Database connections are managed per function call

### Database Considerations
- MongoDB Atlas recommended for production
- Connection pooling handled automatically
- Ensure your MongoDB allows connections from Vercel's IPs

### Environment Variables
- Secure storage in Vercel dashboard
- Available to all serverless functions
- Can be different for preview/production deployments

## Testing Your Deployment

1. **Health Check:**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Registration:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"password123"}'
   ```

3. **Frontend:**
   - Visit `https://your-app.vercel.app`
   - Test user registration and login
   - Add TOTP services and verify functionality

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Set:**
   - Check Vercel dashboard environment variables
   - Ensure MongoDB URI is correct
   - Verify JWT secret is set

2. **CORS Issues:**
   - Check that CORS is properly configured
   - Ensure frontend and API are on same domain

3. **Database Connection:**
   - Verify MongoDB Atlas whitelist includes Vercel IPs
   - Check connection string format
   - Monitor MongoDB Atlas logs

4. **Function Timeouts:**
   - Vercel functions have 10-second timeout by default
   - Optimize database queries
   - Use connection pooling

### Monitoring
- Check Vercel function logs in dashboard
- Monitor MongoDB Atlas metrics
- Set up error tracking (Sentry, etc.)

## Benefits of This Architecture

1. **Serverless Backend:**
   - No server management required
   - Automatic scaling
   - Pay-per-use pricing
   - Built-in security and SSL

2. **Integrated Deployment:**
   - Single deployment for full-stack app
   - Preview deployments for pull requests
   - Atomic deployments with rollback capability

3. **Performance:**
   - Global CDN for static assets
   - Edge functions for API routes
   - Optimized for speed and reliability

## Next Steps

After deployment:
1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up backup strategies for MongoDB
4. Consider adding rate limiting for API endpoints
5. Implement logging and analytics