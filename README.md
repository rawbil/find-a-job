# Find a Job - Deployment Guide

This guide provides step-by-step instructions for deploying the Find a Job application to Render.

## Prerequisites

1. Render account (https://render.com)
2. Git repository
3. Node.js and npm/yarn installed locally
4. MongoDB Atlas account (for backend)
5. Cloudinary account (for image storage)
6. Gmail account (for email functionality)

## Deployment Steps

### 1. Backend Deployment

1. Create a new Web Service on Render:
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Select "Node.js" as the environment
   - Connect your Git repository
   - Set the root directory to `/backend`
   - Set the build command to: `npm install`
   - Set the start command to: `npm run start`

2. Environment Variables:
   - Create environment variables in Render's dashboard using the values from `.env.example`
   - Important variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `CLOUDINARY_*`: Your Cloudinary credentials
     - `SMTP_*`: Your Gmail SMTP credentials

### 2. Frontend Deployment

1. Create a new Static Site on Render:
   - Go to https://dashboard.render.com
   - Click "New +" → "Static Site"
   - Connect your Git repository
   - Set the root directory to `/frontend`
   - Set the build command to: `npm run build`
   - Set the publish directory to: `dist`

2. Environment Variables:
   - Create environment variables in Render's dashboard using the values from `.env.example`
   - Important variables:
     - `VITE_API_URL`: Your backend URL from Render

### 3. Configuration Files

1. Create `.env` files:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in the appropriate values for your environment

2. Git Ignore:
   - Ensure both `.env` files are in your `.gitignore` to prevent sensitive information from being committed

## Build Error Prevention

1. Common Build Issues:
   - Missing environment variables
   - Incorrect Node.js version
   - Missing dependencies
   - CORS configuration issues

2. Prevention Tips:
   - Always test locally before deploying
   - Use the same Node.js version locally as in production
   - Keep dependencies up to date
   - Double-check environment variables in Render's dashboard
   - Enable verbose logging in Render's dashboard for debugging

## Troubleshooting

1. Build Failures:
   - Check Render's build logs
   - Verify all dependencies are installed
   - Ensure all required environment variables are set

2. Runtime Issues:
   - Check Render's service logs
   - Verify CORS configuration
   - Check database connection
   - Verify email service configuration

## Security Notes

1. Never commit `.env` files to version control
2. Rotate sensitive credentials regularly
3. Use strong, random values for secrets
4. Keep API keys and credentials in environment variables only

## Updating the Application

1. Make changes to your code
2. Commit and push to your repository
3. Render will automatically detect changes and rebuild
4. Monitor the build logs for any issues
