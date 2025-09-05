# Tesk Trak Deployment Guide

This guide covers multiple deployment options for the Tesk Trak application, from quick cloud deployments to self-hosted solutions.

## Quick Deployment Options

### 1. Railway (Recommended for Beginners) 🚀

Railway provides the easiest full-stack deployment with automatic database provisioning.

**Steps:**
1. **Prepare your repository:**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Deploy on Railway:**
   - Visit [railway.app](https://railway.app)
   - Click "Start a New Project" → "Deploy from GitHub repo"
   - Select your `tesk-trak` repository
   - Railway will automatically detect and build your application

3. **Add MongoDB:**
   - In your Railway project, click "New Service" → "Database" → "MongoDB"
   - Railway will automatically provide the `MONGODB_URI` environment variable

4. **Set environment variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-key
   CLIENT_URL=https://your-app.railway.app
   ```

5. **Custom domain (optional):**
   - Go to Settings → Networking → Custom Domain
   - Add your domain and configure DNS

**Estimated time:** 10-15 minutes  
**Cost:** Free tier available, $5/month for hobby use  
**Best for:** Quick deployment, prototypes, small to medium applications

### 2. Vercel Frontend + Railway Backend

Split deployment for optimal performance and scaling.

**Frontend on Vercel:**
1. **Prepare frontend deployment:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project" → Import your repository
   - Set build settings:
     - Framework: React
     - Build Command: `cd client && npm run build`
     - Output Directory: `client/build`

3. **Environment variables for Vercel:**
   ```env
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

**Backend on Railway:**
1. **Create a new Railway project for backend only**
2. **Set environment variables:**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-jwt-secret
   CLIENT_URL=https://your-frontend.vercel.app
   ```

**Estimated time:** 20-25 minutes  
**Best for:** High-performance applications, better SEO, CDN benefits

### 3. Heroku (Traditional)

**Prerequisites:**
- Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Create Heroku account

**Steps:**
1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create tesk-trak-your-name
   ```

3. **Add MongoDB Atlas:**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secure-jwt-secret
   heroku config:set CLIENT_URL=https://tesk-trak-your-name.herokuapp.com
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

**Estimated time:** 15-20 minutes  
**Cost:** Free tier discontinued, starts at $7/month

## Advanced Deployment Options

### 4. Docker Deployment

**Local Docker Setup:**
```bash
# Build and run with Docker Compose
npm run docker:run

# For development with hot reload
npm run docker:dev

# Stop all services
npm run docker:stop
```

**Production Docker:**
```bash
# Build production image
docker build -t tesk-trak .

# Run with external MongoDB
docker run -d \
  --name tesk-trak-app \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://your-mongodb-host:27017/tesk-trak \
  -e JWT_SECRET=your-jwt-secret \
  -e NODE_ENV=production \
  tesk-trak
```

### 5. AWS EC2 Deployment

**Prerequisites:**
- AWS Account
- EC2 instance (t2.micro eligible for free tier)
- Security group allowing HTTP (80), HTTPS (443), and SSH (22)

**Steps:**
1. **Connect to your EC2 instance:**
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

2. **Install Node.js and MongoDB:**
   ```bash
   # Install Node.js
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs

   # Install MongoDB
   sudo yum install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

3. **Clone and setup your application:**
   ```bash
   git clone https://github.com/your-username/tesk-trak.git
   cd tesk-trak
   npm run install-all
   cp .env.example .env
   # Edit .env with your configuration
   npm run build
   ```

4. **Setup PM2 for process management:**
   ```bash
   sudo npm install -g pm2
   pm2 start server/server.js --name tesk-trak
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx reverse proxy:**
   ```bash
   sudo yum install -y nginx
   sudo nano /etc/nginx/conf.d/tesk-trak.conf
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Start Nginx:**
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

**Best for:** Full control, custom configurations, high-performance requirements

### 6. DigitalOcean App Platform

1. **Create new app on DigitalOcean:**
   - Connect your GitHub repository
   - Choose "Web Service"

2. **Configure build settings:**
   - Build Command: `npm run install-all && npm run build`
   - Run Command: `npm start`

3. **Add MongoDB database:**
   - Add "Database" component
   - Choose MongoDB

4. **Environment variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=${APP_SECRET}
   MONGODB_URI=${DATABASE_URL}
   ```

## Database Setup Options

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas account:** [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create a new cluster** (free tier available)
3. **Create database user** with read/write permissions
4. **Whitelist IP addresses** (0.0.0.0/0 for all IPs)
5. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/tesk-trak?retryWrites=true&w=majority
   ```

### Local MongoDB

```bash
# Install MongoDB Community Edition
# Ubuntu/Debian:
sudo apt-get install -y mongodb

# macOS:
brew install mongodb-community

# Windows:
# Download from https://www.mongodb.com/download-center/community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

## Environment Variables Reference

### Required Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tesk-trak
JWT_SECRET=your-super-secure-random-string
CLIENT_URL=https://your-domain.com
```

### Optional Variables
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Credits System
DEFAULT_FIRST_PLACE_CREDITS=1000
DEFAULT_SECOND_PLACE_CREDITS=750
DEFAULT_THIRD_PLACE_CREDITS=500
```

## Post-Deployment Checklist

### 1. Test Core Functionality
- [ ] Health check endpoint: `GET /api/health`
- [ ] User registration: `POST /api/auth/register`
- [ ] User login: `POST /api/auth/login`
- [ ] Create productivity record
- [ ] Generate monthly rankings

### 2. Security Verification
- [ ] Change default admin password
- [ ] Verify JWT_SECRET is secure and unique
- [ ] Check CORS configuration
- [ ] Ensure HTTPS is enabled
- [ ] Verify environment variables are not exposed

### 3. Performance Optimization
- [ ] Enable gzip compression
- [ ] Setup CDN for static assets
- [ ] Monitor database performance
- [ ] Setup application monitoring (optional)

### 4. Backup Strategy
- [ ] Setup automated database backups
- [ ] Document recovery procedures
- [ ] Test backup restoration

## Monitoring and Maintenance

### Application Monitoring
- **Railway:** Built-in monitoring dashboard
- **Heroku:** Heroku Metrics or third-party tools
- **Self-hosted:** PM2 monitoring, New Relic, or DataDog

### Log Management
```bash
# PM2 logs (for self-hosted)
pm2 logs tesk-trak

# Railway logs
railway logs

# Heroku logs
heroku logs --tail
```

### Database Monitoring
- **MongoDB Atlas:** Built-in monitoring
- **Self-hosted:** MongoDB Compass, mongostat, mongotop

## Troubleshooting

### Common Issues

**1. "Cannot connect to MongoDB"**
- Check MONGODB_URI format
- Verify network connectivity
- Ensure database server is running

**2. "JWT Secret not provided"**
- Set JWT_SECRET environment variable
- Restart the application

**3. "CORS Error"**
- Update CLIENT_URL environment variable
- Check CORS configuration in server.js

**4. "Build failed"**
- Check Node.js version (requires 16+)
- Verify all dependencies are installed
- Check build logs for specific errors

### Getting Help
- Check application logs first
- Verify environment variables
- Test API endpoints with curl or Postman
- Check database connectivity

## Cost Estimation

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Railway | Limited | $5-20/month | Quick deployment |
| Vercel | Generous | $20/month | Frontend |
| Heroku | None | $7-25/month | Traditional |
| AWS EC2 | 12 months | $10-50/month | Full control |
| DigitalOcean | $200 credit | $10-50/month | Simplicity |

Choose based on your budget, technical requirements, and scaling needs.
