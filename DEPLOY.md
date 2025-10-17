# 🚀 Complete Free Deployment Guide for RoboticsShop

## 📋 Overview
This guide will help you deploy your **RoboticsShop** (Laravel Backend + React Frontend) completely **FREE** with HTTPS access so anyone can access your website from anywhere in the world.

## 🏗️ Application Architecture Analysis
Based on your workspace analysis:

**Backend (Laravel 12):**
- PHP 8.2+ with Laravel Sanctum authentication
- MySQL database with comprehensive e-commerce features
- PayPal integration for payments
- File uploads and image handling
- API-based architecture

**Frontend (React + TypeScript):**
- Vite build system
- Material-UI components
- Redux state management
- PayPal integration

## 🎯 Deployment Strategy
We'll use these **FREE** services:
1. **Railway.app** - For Laravel backend (MySQL included)
2. **Vercel** - For React frontend
3. **Cloudinary** - For image storage
4. **Free domain** from Freenom (optional)

---

## 🛠️ Step 1: Pre-Deployment Setup

### 1.1 Install Required Tools
Download and install these if you don't have them:

1. **Git**: https://git-scm.com/downloads
2. **Node.js** (18+): https://nodejs.org/
3. **Composer**: https://getcomposer.org/download/

### 1.2 Verify Installation
Open PowerShell and run:
```powershell
git --version
node --version
npm --version
php --version
composer --version
```

---

## 🚂 Step 2: Deploy Backend on Railway

### 2.1 Create Railway Account
1. Go to https://railway.app/
2. Click "Start a New Project"
3. Sign up with GitHub (recommended)
4. Verify your account

### 2.2 Prepare Backend for Railway

#### Create Railway Configuration Files:

**File: `backend/railway.toml`**
```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/up"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10
```

**File: `backend/nixpacks.toml`**
```toml
[phases.setup]
nixPkgs = ["php82", "php82Packages.composer", "nodejs_18"]

[phases.install]
cmds = ["composer install --no-dev --optimize-autoloader"]

[phases.build]
cmds = [
    "php artisan config:clear",
    "php artisan cache:clear",
    "php artisan view:clear",
    "php artisan storage:link"
]

[start]
cmd = "php artisan serve --host=0.0.0.0 --port=$PORT"
```

### 2.3 Update Backend Environment Configuration

**File: `backend/.env.production`** (create this file)
```env
APP_NAME=RoboticsShop
APP_ENV=production
APP_KEY=base64:rmPZh5hrYIbvA/p9qKxjpVb+rpb7oNKrlfg3AgDRT2U=
APP_DEBUG=false
APP_URL=https://your-app-name.up.railway.app

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
PHP_CLI_SERVER_WORKERS=4
BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

# Database (Railway MySQL)
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=cloudinary
QUEUE_CONNECTION=database

CACHE_STORE=database
REDIS_CLIENT=phpredis

# Mail Configuration (using Gmail SMTP - FREE)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="RoboticsShop"

# Cloudinary Configuration (FREE tier)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=

# Frontend URL (will be updated after Vercel deployment)
FRONTEND_URL=https://your-frontend-domain.vercel.app

VITE_APP_NAME=RoboticsShop
```

### 2.4 Update Backend Configuration for Production

**File: `backend/config/filesystems.php`** (add cloudinary disk)
```php
// Add this to your 'disks' array
'cloudinary' => [
    'driver' => 'cloudinary',
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'options' => [
        'folder' => 'roboticsshop',
    ],
],
```

### 2.5 Install Cloudinary Package
```powershell
cd backend
composer require cloudinary-labs/cloudinary-laravel
```

### 2.6 Deploy to Railway

1. **Create New Project**:
   - Go to https://railway.app/new
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository
   - Choose the `backend` folder

2. **Add MySQL Database**:
   - In your Railway project dashboard
   - Click "New Service" → "Database" → "MySQL"
   - Railway will automatically create database credentials

3. **Configure Environment Variables**:
   - Go to your backend service settings
   - Navigate to "Variables" tab
   - Add all environment variables from `.env.production`
   - Railway will automatically provide MySQL variables

4. **Deploy**:
   - Railway will automatically deploy your backend
   - Note your backend URL (e.g., `https://your-backend.up.railway.app`)

---

## ☁️ Step 3: Setup Cloudinary (Free Image Storage)

### 3.1 Create Cloudinary Account
1. Go to https://cloudinary.com/
2. Sign up for free account
3. Go to Dashboard → Settings → API Keys
4. Note down:
   - Cloud Name
   - API Key
   - API Secret

### 3.2 Create Upload Preset
1. Go to Settings → Upload
2. Click "Add upload preset"
3. Set:
   - Preset name: `roboticsshop_products`
   - Signing Mode: `Unsigned`
   - Folder: `roboticsshop/products`
4. Save preset

### 3.3 Update Railway Environment Variables
Add these to your Railway backend service:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=roboticsshop_products
```

---

## 🚀 Step 4: Deploy Frontend on Vercel

### 4.1 Create Vercel Account
1. Go to https://vercel.com/
2. Sign up with GitHub
3. Verify your account

### 4.2 Prepare Frontend for Deployment

**File: `frontend/.env.production`** (create this file)
```env
VITE_API_BASE_URL=https://your-backend.up.railway.app/api
VITE_APP_NAME=RoboticsShop
VITE_APP_VERSION=1.0.0

# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 4.3 Update Frontend API Configuration

**File: `frontend/src/services/api.ts`** (update if needed)
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend.up.railway.app/api';
```

### 4.4 Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your repository
3. Set Framework Preset to "Vite"
4. Set Root Directory to `frontend`
5. Add environment variables from `.env.production`
6. Deploy

#### Option B: Deploy via CLI
```powershell
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# Set up project? Yes
# Which scope? (your account)
# Link to existing project? No
# Project name? roboticsshop-frontend
# Directory? ./
# Override settings? No
```

---

## 🔧 Step 5: Configure CORS and Final Setup

### 5.1 Update Backend CORS Configuration

**File: `backend/app/Http/Middleware/CorsMiddleware.php`** (create if doesn't exist)
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $allowedOrigins = [
            'http://localhost:5173',
            'https://your-frontend-domain.vercel.app', // Update with your actual domain
        ];

        $origin = $request->header('Origin');

        if (in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
```

### 5.2 Update Environment Variables

After deployment, update these:

**Railway Backend Variables:**
```
FRONTEND_URL=https://your-actual-frontend-domain.vercel.app
```

**Vercel Frontend Variables:**
```
VITE_API_BASE_URL=https://your-actual-backend-domain.up.railway.app/api
```

---

## 📧 Step 6: Setup Email (Gmail SMTP - FREE)

### 6.1 Generate Gmail App Password
1. Go to your Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate app password for "Mail"
4. Use this password in MAIL_PASSWORD

### 6.2 Update Railway Environment Variables
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-generated-app-password
MAIL_ENCRYPTION=tls
```

---

## 💳 Step 7: Setup PayPal (Optional)

### 7.1 Create PayPal Developer Account
1. Go to https://developer.paypal.com/
2. Create account and app
3. Get Client ID and Secret for sandbox/live

### 7.2 Update Environment Variables
Add to both Railway and Vercel:
```
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox
```

---

## 🌐 Step 8: Custom Domain (Optional - FREE)

### 8.1 Get Free Domain
1. Go to https://www.freenom.com/
2. Search for available .tk, .ml, .ga, .cf domains
3. Register for free (12 months)

### 8.2 Configure Domain
1. **For Frontend (Vercel)**:
   - Go to Vercel project settings
   - Domains tab → Add domain
   - Follow DNS configuration

2. **For Backend (Railway)**:
   - Go to Railway project settings
   - Domains tab → Add domain
   - Configure CNAME record

---

## ✅ Step 9: Final Testing Checklist

### 9.1 Test Backend
- [ ] Visit `https://your-backend.up.railway.app/up` (should return OK)
- [ ] Test API endpoints: `https://your-backend.up.railway.app/api/products`
- [ ] Check database connection
- [ ] Test file uploads

### 9.2 Test Frontend
- [ ] Visit your frontend URL
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test PayPal integration

### 9.3 Test Integration
- [ ] Frontend can fetch data from backend
- [ ] CORS is working properly
- [ ] Authentication flows work
- [ ] Email notifications work

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Ensure your frontend URL is added to CORS middleware and FRONTEND_URL environment variable.

### Issue 2: Database Connection Failed
**Solution**: Check if Railway MySQL environment variables are correctly set.

### Issue 3: Images Not Loading
**Solution**: Verify Cloudinary configuration and upload preset settings.

### Issue 4: PayPal Not Working
**Solution**: Ensure PayPal Client ID is same in both frontend and backend environment variables.

---

## 📱 Step 10: Share Your Website

Once deployed, your website will be accessible at:
- **Frontend**: `https://your-frontend-domain.vercel.app`
- **Backend API**: `https://your-backend-domain.up.railway.app`

You can share the frontend URL with anyone, and they'll be able to:
- Browse products
- Register/login
- Place orders
- Make payments via PayPal
- Contact support

---

## 💰 Cost Breakdown (All FREE!)

| Service | Free Tier Limits | Cost |
|---------|------------------|------|
| Railway | 500 hours/month, 1GB RAM | $0 |
| Vercel | 100GB bandwidth, unlimited projects | $0 |
| Cloudinary | 25 credits/month, 25GB storage | $0 |
| Freenom Domain | 12 months | $0 |
| Gmail SMTP | Personal use | $0 |
| **Total** | | **$0** |

---

## 🔄 Automatic Deployments

Both Railway and Vercel support automatic deployments:
- Push to `main` branch → Automatic deployment
- Railway: Backend auto-deploys
- Vercel: Frontend auto-deploys

---

## 📈 Monitoring & Analytics

### Free Monitoring Tools:
1. **Railway**: Built-in metrics and logs
2. **Vercel**: Analytics and performance metrics
3. **Cloudinary**: Usage statistics
4. **Google Analytics**: Website traffic (free)

---

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Both services provide free SSL certificates
3. **Database**: Railway MySQL is secured by default
4. **Authentication**: Laravel Sanctum provides secure API authentication
5. **File Uploads**: Cloudinary handles secure file storage

---

## 📞 Support & Resources

- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Laravel Deployment**: https://laravel.com/docs/deployment

---

## ⚡ Next Steps After Deployment

1. **Test everything thoroughly**
2. **Set up monitoring and alerts**
3. **Configure backup strategies**
4. **Optimize performance**
5. **Set up Google Analytics**
6. **Create admin documentation**

---

Your RoboticsShop is now ready for the world! 🎉

**Remember**: Keep your credentials secure and regularly update your dependencies for security patches.