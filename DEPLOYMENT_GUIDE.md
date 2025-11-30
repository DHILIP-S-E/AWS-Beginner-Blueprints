# AWS Blueprint - Deployment Guide

## 🚀 Deployment Options

This guide covers various deployment options for the AWS Blueprint application, from simple static hosting to enterprise-grade deployments.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Static Hosting Deployments](#static-hosting-deployments)
3. [AWS Deployments](#aws-deployments)
4. [Other Cloud Providers](#other-cloud-providers)
5. [Custom Server Deployments](#custom-server-deployments)
6. [CI/CD Pipelines](#cicd-pipelines)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Security Considerations](#security-considerations)
10. [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

### Required Files
Ensure your project contains these essential files:
- `index.html` - Main HTML file
- `css/` - All stylesheet files
- `js/` - All JavaScript files
- `data/knowledge-base.json` - Knowledge base data
- `assets/icons/` - AWS service icons

### Build Preparation
```bash
# 1. Test locally first
python -m http.server 8000
# or
npx http-server -p 8000

# 2. Run tests
npm test

# 3. Validate JSON
node -e "console.log('Valid JSON:', JSON.parse(require('fs').readFileSync('data/knowledge-base.json')))"

# 4. Check file sizes
du -sh css/ js/ data/ assets/
```

## 🌐 Static Hosting Deployments

### 1. Netlify (Recommended for Beginners)

#### Method 1: Drag & Drop
1. Go to [netlify.com](https://netlify.com)
2. Drag your project folder to the deploy area
3. Your site will be live instantly

#### Method 2: Git Integration
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Netlify"
git push origin main

# 2. Connect repository in Netlify dashboard
# 3. Configure build settings:
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  publish = "."
  command = "echo 'No build required'"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.json"
  [headers.values]
    Content-Type = "application/json"

[[headers]]
  for = "*.svg"
  [headers.values]
    Content-Type = "image/svg+xml"

[build.environment]
  NODE_VERSION = "18"
```

#### Custom Domain Setup
```bash
# 1. In Netlify dashboard: Site settings > Domain management
# 2. Add custom domain
# 3. Configure DNS records:
#    CNAME: www.yourdomain.com -> your-site.netlify.app
#    A: yourdomain.com -> 75.2.60.5
```

### 2. Vercel

#### CLI Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod

# Custom domain
vercel domains add yourdomain.com
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 3. GitHub Pages

#### Setup
```bash
# 1. Create repository on GitHub
# 2. Push your code
git add .
git commit -m "Initial commit"
git push origin main

# 3. Enable GitHub Pages
# Go to: Settings > Pages > Source: Deploy from branch > main
```

**GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## ☁️ AWS Deployments

### 1. S3 + CloudFront (Recommended for Production)

#### Step 1: Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://your-aws-blueprint-site

# Configure for static website hosting
aws s3 website s3://your-aws-blueprint-site \
  --index-document index.html \
  --error-document index.html
```

#### Step 2: Upload Files
```bash
# Sync files to S3
aws s3 sync . s3://your-aws-blueprint-site \
  --exclude "node_modules/*" \
  --exclude ".git/*" \
  --exclude "*.md" \
  --exclude "package*.json" \
  --delete

# Set proper content types
aws s3 cp s3://your-aws-blueprint-site/data/knowledge-base.json \
  s3://your-aws-blueprint-site/data/knowledge-base.json \
  --content-type "application/json" \
  --metadata-directive REPLACE

# Set SVG content type
aws s3 cp s3://your-aws-blueprint-site/assets/icons/ \
  s3://your-aws-blueprint-site/assets/icons/ \
  --recursive \
  --content-type "image/svg+xml" \
  --metadata-directive REPLACE
```

#### Step 3: Create CloudFront Distribution
```bash
# Create distribution configuration
cat > cloudfront-config.json << EOF
{
  "CallerReference": "aws-blueprint-$(date +%s)",
  "Comment": "AWS Blueprint CDN",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-your-aws-blueprint-site",
        "DomainName": "your-aws-blueprint-site.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-aws-blueprint-site",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF

# Create distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

#### Step 4: Deployment Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Deploying AWS Blueprint..."

# Build and test
echo "📦 Running tests..."
npm test

# Sync to S3
echo "📤 Uploading to S3..."
aws s3 sync . s3://your-aws-blueprint-site \
  --exclude "node_modules/*" \
  --exclude ".git/*" \
  --exclude "*.md" \
  --exclude "package*.json" \
  --exclude "deploy.sh" \
  --delete

# Set content types
echo "🔧 Setting content types..."
aws s3 cp s3://your-aws-blueprint-site/data/ \
  s3://your-aws-blueprint-site/data/ \
  --recursive \
  --content-type "application/json" \
  --metadata-directive REPLACE

aws s3 cp s3://your-aws-blueprint-site/assets/icons/ \
  s3://your-aws-blueprint-site/assets/icons/ \
  --recursive \
  --content-type "image/svg+xml" \
  --metadata-directive REPLACE

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Site URL: https://your-distribution-id.cloudfront.net"
```

### 2. AWS Amplify

#### Method 1: Amplify Console
1. Go to AWS Amplify Console
2. Connect your Git repository
3. Configure build settings:

**Build Specification** (`amplify.yml`):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "No build required for static site"
    build:
      commands:
        - echo "Building static site..."
    postBuild:
      commands:
        - echo "Post-build complete"
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
  cache:
    paths: []
```

#### Method 2: Amplify CLI
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

## 🌍 Other Cloud Providers

### 1. Google Cloud Platform (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

**Firebase Configuration** (`firebase.json`):
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/*.md"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.json",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ]
      },
      {
        "source": "**/*.svg",
        "headers": [
          {
            "key": "Content-Type",
            "value": "image/svg+xml"
          }
        ]
      }
    ]
  }
}
```

### 2. Microsoft Azure (Static Web Apps)

```bash
# Install Azure CLI
# Create static web app
az staticwebapp create \
  --name aws-blueprint \
  --resource-group myResourceGroup \
  --source https://github.com/yourusername/aws-blueprint \
  --location "Central US" \
  --branch main \
  --app-location "/" \
  --api-location "" \
  --output-location "/"
```

**Azure Configuration** (`staticwebapp.config.json`):
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "mimeTypes": {
    ".json": "application/json",
    ".svg": "image/svg+xml"
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block"
  }
}
```

## 🖥️ Custom Server Deployments

### 1. Docker Deployment

**Dockerfile:**
```dockerfile
FROM nginx:alpine

# Copy application files
COPY . /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # JSON files
        location ~* \.json$ {
            add_header Content-Type application/json;
            expires 1h;
        }
    }
}
```

**Build and Deploy:**
```bash
# Build Docker image
docker build -t aws-blueprint .

# Run container
docker run -d -p 80:80 --name aws-blueprint-app aws-blueprint

# Or use Docker Compose
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### 2. Node.js Express Server

**server.js:**
```javascript
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "*.amazonaws.com"],
      scriptSrc: ["'self'"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Serve static files
app.use(express.static('.', {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Set proper content types
app.get('*.json', (req, res, next) => {
  res.type('application/json');
  next();
});

app.get('*.svg', (req, res, next) => {
  res.type('image/svg+xml');
  next();
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AWS Blueprint running on port ${PORT}`);
});
```

**package.json (server):**
```json
{
  "name": "aws-blueprint-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "compression": "^1.7.4",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🔄 CI/CD Pipelines

### 1. GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy AWS Blueprint

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  AWS_REGION: us-east-1
  S3_BUCKET: your-aws-blueprint-site
  CLOUDFRONT_DISTRIBUTION_ID: YOUR_DISTRIBUTION_ID

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Validate JSON
      run: |
        node -e "JSON.parse(require('fs').readFileSync('data/knowledge-base.json'))"
        echo "✅ JSON is valid"

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Deploy to S3
      run: |
        aws s3 sync . s3://${{ env.S3_BUCKET }} \
          --exclude "node_modules/*" \
          --exclude ".git/*" \
          --exclude ".github/*" \
          --exclude "*.md" \
          --exclude "package*.json" \
          --delete
    
    - name: Set content types
      run: |
        aws s3 cp s3://${{ env.S3_BUCKET }}/data/ \
          s3://${{ env.S3_BUCKET }}/data/ \
          --recursive \
          --content-type "application/json" \
          --metadata-directive REPLACE
          
        aws s3 cp s3://${{ env.S3_BUCKET }}/assets/icons/ \
          s3://${{ env.S3_BUCKET }}/assets/icons/ \
          --recursive \
          --content-type "image/svg+xml" \
          --metadata-directive REPLACE
    
    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation \
          --distribution-id ${{ env.CLOUDFRONT_DISTRIBUTION_ID }} \
          --paths "/*"
    
    - name: Deployment Summary
      run: |
        echo "🚀 Deployment completed successfully!"
        echo "📊 Site URL: https://${{ env.CLOUDFRONT_DISTRIBUTION_ID }}.cloudfront.net"
```

### 2. GitLab CI/CD

**.gitlab-ci.yml:**
```yaml
stages:
  - test
  - deploy

variables:
  AWS_DEFAULT_REGION: us-east-1
  S3_BUCKET: your-aws-blueprint-site

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
    - node -e "JSON.parse(require('fs').readFileSync('data/knowledge-base.json'))"
  only:
    - merge_requests
    - main

deploy:
  stage: deploy
  image: amazon/aws-cli:latest
  before_script:
    - apk add --no-cache nodejs npm
  script:
    - npm ci
    - npm test
    - aws s3 sync . s3://$S3_BUCKET --exclude "node_modules/*" --exclude ".git/*" --delete
    - aws s3 cp s3://$S3_BUCKET/data/ s3://$S3_BUCKET/data/ --recursive --content-type "application/json" --metadata-directive REPLACE
    - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
  only:
    - main
```

## ⚡ Performance Optimization

### 1. Asset Optimization

```bash
# Minify CSS (optional)
npm install -g clean-css-cli
cleancss -o css/styles.min.css css/styles.css

# Optimize SVG icons
npm install -g svgo
svgo assets/icons/*.svg

# Compress images (if any)
npm install -g imagemin-cli
imagemin assets/images/* --out-dir=assets/images/optimized
```

### 2. Caching Strategy

**CloudFront Cache Behaviors:**
```json
{
  "CacheBehaviors": [
    {
      "PathPattern": "*.html",
      "DefaultTTL": 300,
      "MaxTTL": 3600
    },
    {
      "PathPattern": "*.json",
      "DefaultTTL": 3600,
      "MaxTTL": 86400
    },
    {
      "PathPattern": "*.css",
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    },
    {
      "PathPattern": "*.js",
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    },
    {
      "PathPattern": "*.svg",
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    }
  ]
}
```

### 3. Service Worker (Optional)

**sw.js:**
```javascript
const CACHE_NAME = 'aws-blueprint-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/app.js',
  '/data/knowledge-base.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

## 📊 Monitoring & Analytics

### 1. Google Analytics 4

Add to `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. AWS CloudWatch (for AWS deployments)

**Custom Metrics:**
```javascript
// Add to app.js
function trackEvent(eventName, properties) {
  if (window.gtag) {
    gtag('event', eventName, properties);
  }
  
  // Custom tracking
  console.log('Event:', eventName, properties);
}

// Track search events
function handleIntentSearch(query) {
  trackEvent('search', {
    query: query,
    timestamp: new Date().toISOString()
  });
  
  // ... existing search logic
}
```

### 3. Error Monitoring

**Sentry Integration:**
```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: "production"
  });
</script>
```

## 🔒 Security Considerations

### 1. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  img-src 'self' data: *.amazonaws.com;
  script-src 'self';
  connect-src 'self';
">
```

### 2. Security Headers

**Netlify** (`_headers`):
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 3. HTTPS Enforcement

All deployment methods should enforce HTTPS:
- Netlify: Automatic
- Vercel: Automatic
- AWS CloudFront: Configure redirect-to-https
- Custom servers: Use Let's Encrypt or similar

## 🔧 Troubleshooting

### Common Deployment Issues

#### 1. JSON Loading Errors
**Problem:** `Failed to fetch knowledge-base.json`
**Solutions:**
- Ensure proper MIME type: `application/json`
- Check CORS headers
- Verify file path and permissions

#### 2. SVG Icons Not Loading
**Problem:** Icons show as broken images
**Solutions:**
- Set correct MIME type: `image/svg+xml`
- Check file paths and naming
- Verify SVG file validity

#### 3. CloudFront Caching Issues
**Problem:** Updates not reflecting
**Solutions:**
```bash
# Invalidate cache
aws cloudfront create-invalidation --distribution-id ID --paths "/*"

# Check cache headers
curl -I https://your-domain.com/
```

#### 4. Mobile Layout Issues
**Problem:** Layout broken on mobile
**Solutions:**
- Verify viewport meta tag
- Test responsive CSS
- Check media queries

### Performance Issues

#### 1. Slow Loading
**Diagnostics:**
```bash
# Test with Lighthouse
npx lighthouse https://your-domain.com --output html

# Check bundle sizes
du -sh css/ js/ data/ assets/
```

**Solutions:**
- Enable compression (gzip/brotli)
- Optimize images and assets
- Implement caching strategy
- Use CDN for static assets

#### 2. Search Performance
**Problem:** Slow search results
**Solutions:**
- Implement search debouncing
- Optimize matching algorithms
- Consider search indexing
- Profile JavaScript performance

### Monitoring Commands

```bash
# Check site availability
curl -I https://your-domain.com

# Test from different locations
curl -I -H "CF-IPCountry: US" https://your-domain.com
curl -I -H "CF-IPCountry: IN" https://your-domain.com

# Monitor performance
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
```

**curl-format.txt:**
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

---

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Test locally first with `python -m http.server 8000`
4. Verify all files are included in deployment
5. Check browser console for errors

**Happy Deploying! 🚀**