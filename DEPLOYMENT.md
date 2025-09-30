# 🚀 ACHHADAM - Enterprise Deployment Guide

Complete guide for deploying ACHHADAM to production environments.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Manual Deployment](#manual-deployment)
4. [Cloud Platforms](#cloud-platforms)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] All `.env` files configured with production values
- [ ] Database connection strings updated
- [ ] JWT secrets changed from defaults (minimum 32 characters)
- [ ] Session secrets updated
- [ ] CORS origins set to production domains only
- [ ] Redis connection configured
- [ ] Firebase credentials updated
- [ ] Razorpay API keys configured

### 2. Security Audit

- [ ] No hardcoded credentials in code
- [ ] Rate limiting enabled and configured
- [ ] Helmet security headers enabled
- [ ] Input validation active on all endpoints
- [ ] HTTPS enforced
- [ ] Cookie settings secure (httpOnly, secure, sameSite)
- [ ] SQL/NoSQL injection prevention in place

### 3. Performance Optimization

- [ ] Redis caching enabled
- [ ] Database indexes created
- [ ] Frontend assets minified
- [ ] Image optimization implemented
- [ ] CDN configured for static assets
- [ ] Gzip compression enabled

### 4. Testing

- [ ] All unit tests passing
- [ ] Integration tests completed
- [ ] E2E tests executed
- [ ] Load testing performed
- [ ] Security scan completed

---

## 🐳 Docker Deployment

### Step 1: Prepare Docker Environment

```bash
# Clone repository
git clone https://github.com/yourusername/achhadam.git
cd achhadam

# Create production .env file
cp .env.example .env.production
# Edit .env.production with production values
```

### Step 2: Update docker-compose.yml

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - achhadam-network

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - achhadam-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: ${MONGODB_URI}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongodb
      - redis
    networks:
      - achhadam-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    networks:
      - achhadam-network

networks:
  achhadam-network:
    driver: bridge

volumes:
  mongodb_data:
  redis_data:
```

### Step 3: Build and Deploy

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Step 4: SSL Configuration

```bash
# Install certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d achhadam.com -d www.achhadam.com

# Copy certificates
sudo cp /etc/letsencrypt/live/achhadam.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/achhadam.com/privkey.pem ./ssl/

# Restart services
docker-compose -f docker-compose.prod.yml restart frontend
```

---

## 🖥 Manual Deployment

### Backend Deployment

#### 1. Prepare Server

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Redis
sudo apt-get install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Install PM2
sudo npm install -g pm2
```

#### 2. Deploy Backend

```bash
# Clone repository
cd /opt
sudo git clone https://github.com/yourusername/achhadam.git
cd achhadam/backend

# Install dependencies
npm ci --only=production

# Create .env file
sudo nano .env
# Add production environment variables

# Start with PM2
pm2 start server.enterprise.js --name achhadam-api -i max
pm2 save
pm2 startup
```

#### 3. Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/achhadam
```

Add:

```nginx
server {
    listen 80;
    server_name api.achhadam.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/achhadam /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Frontend Deployment

#### 1. Build Frontend

```bash
cd /opt/achhadam/frontend
npm ci
npm run build
```

#### 2. Configure Nginx for Frontend

```bash
sudo nano /etc/nginx/sites-available/achhadam-frontend
```

Add:

```nginx
server {
    listen 80;
    server_name achhadam.com www.achhadam.com;

    root /opt/achhadam/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/achhadam-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## ☁️ Cloud Platforms

### AWS Deployment

#### 1. EC2 Instance Setup

```bash
# Launch EC2 instance
# - AMI: Ubuntu Server 22.04 LTS
# - Instance type: t3.medium or higher
# - Security groups: HTTP (80), HTTPS (443), SSH (22), Custom TCP (5000)

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow manual deployment steps above
```

#### 2. RDS for MongoDB

```bash
# Create MongoDB Atlas cluster
# - M10 tier minimum for production
# - Enable VPC peering with EC2
# - Update MONGODB_URI in .env
```

#### 3. ElastiCache for Redis

```bash
# Create ElastiCache Redis cluster
# - cache.t3.micro or higher
# - Update REDIS_URL in .env
```

### Digital Ocean Deployment

```bash
# Create Droplet
# - Ubuntu 22.04
# - 2GB RAM minimum
# - Enable monitoring

# Follow manual deployment steps
```

### Heroku Deployment

#### Backend

```bash
cd backend
heroku create achhadam-api
heroku addons:create mongolab
heroku addons:create heroku-redis
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### Frontend

```bash
cd frontend
# Build and deploy via static site hosting
# Use Vercel, Netlify, or Heroku static buildpack
```

### Render.com Deployment

Create `render.yaml`:

```yaml
services:
  - type: web
    name: achhadam-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true

  - type: web
    name: achhadam-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
```

---

## 📊 Monitoring & Maintenance

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs achhadam-api

# Restart application
pm2 restart achhadam-api

# Check memory usage
pm2 list
```

### 2. Database Monitoring

```bash
# MongoDB stats
mongosh
use achhadam
db.stats()

# Redis stats
redis-cli info
```

### 3. Log Management

```bash
# View application logs
tail -f /opt/achhadam/backend/logs/combined.log

# View error logs
tail -f /opt/achhadam/backend/logs/error.log

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 4. Backup Strategy

```bash
# MongoDB backup script
#!/bin/bash
mongodump --uri="$MONGODB_URI" --out="/backups/$(date +%Y%m%d)"

# Schedule with cron
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### 5. SSL Renewal

```bash
# Auto-renew SSL certificates
sudo certbot renew --dry-run

# Add to crontab
0 0 1 * * certbot renew --quiet && systemctl reload nginx
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongosh "$MONGODB_URI"
```

#### 2. Redis Connection Failed

```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping
```

#### 3. High Memory Usage

```bash
# Check memory
free -h

# Restart services
pm2 restart all
docker-compose restart
```

#### 4. Slow API Response

```bash
# Enable Redis caching
# Check database indexes
# Monitor query performance
# Scale horizontally
```

#### 5. WebSocket Not Connecting

```bash
# Check Nginx configuration
# Verify proxy_pass settings
# Check firewall rules
# Verify CORS settings
```

### Performance Tuning

#### Node.js

```bash
# Increase max memory
NODE_OPTIONS="--max-old-space-size=4096" pm2 start server.js
```

#### MongoDB

```bash
# Create indexes
db.crops.createIndex({ farmerId: 1, createdAt: -1 })
db.orders.createIndex({ buyerId: 1, status: 1 })
```

#### Redis

```bash
# Set max memory
redis-cli config set maxmemory 2gb
redis-cli config set maxmemory-policy allkeys-lru
```

---

## 📞 Support

For deployment issues:

- 📧 Email: devops@achhadam.com
- 📖 Docs: https://docs.achhadam.com/deployment
- 💬 Discord: https://discord.gg/achhadam

---

**Made with ❤️ for Production Deployment**