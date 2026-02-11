# Deployment Guide

This guide covers deploying the PDF Revision Scheduler app to various platforms.

## Architecture

- **Frontend**: Static React app (can be deployed to Vercel, Netlify, GitHub Pages)
- **Backend**: Node.js API (can be deployed to Render, Railway, Fly.io, or any VPS)

## Option 1: Render (Recommended - Easy & Free Tier)

### Backend Deployment

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure:**
   - **Name**: `pdf-revision-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npm run generate`
   - **Start Command**: `npm run migrate:deploy && npm start`
   - **Environment Variables**:
     ```
     DATABASE_URL=<Render PostgreSQL URL or file:./prod.db>
     PORT=10000
     JWT_SECRET=<generate-a-random-secret-key>
     CORS_ORIGIN=https://your-frontend-url.vercel.app
     NODE_ENV=production
     ```

4. **Add PostgreSQL Database** (optional, or use SQLite file)
   - Create a PostgreSQL database on Render
   - Use the connection string as `DATABASE_URL`

### Frontend Deployment

1. **Create a new Static Site** on Render
2. **Connect your GitHub repository**
3. **Configure:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

## Option 2: Railway (Simple & Modern)

### Backend

1. **Create new project** on Railway
2. **Deploy from GitHub** → Select `backend` folder
3. **Add environment variables** (same as Render)
4. **Add PostgreSQL** service (or use SQLite)
5. **Deploy**

### Frontend

1. **Create new static site** on Railway
2. **Deploy from GitHub** → Select `frontend` folder
3. **Set build command**: `npm install && npm run build`
4. **Set output directory**: `dist`
5. **Add environment variable**: `VITE_API_URL`

## Option 3: Vercel (Frontend) + Railway/Render (Backend)

### Frontend on Vercel

1. **Import project** on Vercel
2. **Root Directory**: `frontend`
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

### Backend on Railway/Render

Follow the backend deployment steps from Option 1 or 2.

## Option 4: Self-Hosted (VPS)

### Prerequisites
- Ubuntu/Debian server
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy

### Backend Setup

```bash
# On your server
git clone <your-repo>
cd pdf-revision-scheduler/backend
npm install
npm run build
npm run generate

# Create .env file
nano .env
# Add your production environment variables

# Run migrations
npm run migrate:deploy

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name pdf-revision-backend
pm2 save
pm2 startup
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run build

# Serve with Nginx or copy dist/ to web server
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/pdf-revision
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Backend Production `.env`

```env
DATABASE_URL="file:./prod.db"
# OR for PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/dbname"

PORT=3001
JWT_SECRET="<generate-a-strong-random-secret-here>"
CORS_ORIGIN="https://your-frontend-domain.com"
NODE_ENV="production"
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Production `.env`

```env
VITE_API_URL=https://your-backend-domain.com
```

## Database Migration for Production

**Important**: Run migrations before starting the production server:

```bash
cd backend
npm run migrate:deploy
```

This applies all migrations without creating new ones (unlike `migrate dev`).

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is built and deployed
- [ ] Environment variables are set correctly
- [ ] Database migrations are applied
- [ ] CORS is configured to allow frontend domain
- [ ] JWT secret is strong and secure
- [ ] HTTPS is enabled (for production)
- [ ] Test login functionality
- [ ] Test PDF creation
- [ ] Test schedule generation

## Troubleshooting

### Backend won't start
- Check environment variables are set
- Verify database connection
- Check logs: `pm2 logs` or platform logs

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Verify backend is accessible from browser

### Database errors
- Run migrations: `npm run migrate:deploy`
- Check database file permissions
- Verify `DATABASE_URL` is correct

## Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT secrets** - Generate random 32+ character strings
3. **Enable HTTPS** - Always use HTTPS in production
4. **Set proper CORS** - Only allow your frontend domain
5. **Database security** - If using PostgreSQL, use strong passwords

## Quick Deploy Commands

### Build for Production

**Backend:**
```bash
cd backend
npm install
npm run build
npm run generate
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Output in frontend/dist/
```

## Support

For platform-specific issues, refer to:
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
