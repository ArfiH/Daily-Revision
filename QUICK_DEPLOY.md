# Quick Deployment Guide

## Fastest Option: Render (Free Tier)

### Step 1: Deploy Backend

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `pdf-revision-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npm run generate`
   - **Start Command**: `npm run migrate:deploy && npm start`
5. Add Environment Variables:
   ```
   DATABASE_URL=file:./prod.db
   PORT=10000
   JWT_SECRET=<click "Generate" or use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   CORS_ORIGIN=https://your-frontend.onrender.com (update after frontend deploy)
   NODE_ENV=production
   ```
6. Click **"Create Web Service"**
7. **Copy the backend URL** (e.g., `https://pdf-revision-backend.onrender.com`)

### Step 2: Deploy Frontend

1. On Render, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `pdf-revision-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=<paste-backend-url-from-step-1>
   ```
5. Click **"Create Static Site"**
6. **Copy the frontend URL**

### Step 3: Update Backend CORS

1. Go back to your backend service on Render
2. Go to **Environment** tab
3. Update `CORS_ORIGIN` to your frontend URL
4. **Save changes** (will auto-redeploy)

### Step 4: Create Initial User

1. Go to your backend service → **Shell** tab
2. Run:
   ```bash
   npm run seed
   ```
3. Default credentials:
   - Email: `user@example.com`
   - Password: `password123`

### Done! 🎉

Your app is now live at your frontend URL!

---

## Alternative: Vercel (Frontend) + Render (Backend)

### Frontend on Vercel (Even Easier)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=<your-render-backend-url>
   ```
6. Click **"Deploy"**

**Vercel automatically handles:**
- HTTPS
- CDN
- Auto-deploy on git push
- Custom domains

---

## Testing Your Deployment

1. **Visit your frontend URL**
2. **Login** with seeded credentials
3. **Add a test PDF**:
   - Title: "Test PDF"
   - Total Pages: 100
   - Target End Date: 30 days from now
4. **Check Dashboard** - Should show today's schedule
5. **Check Schedule page** - Should show upcoming days

---

## Troubleshooting

### Backend returns 500 errors
- Check Render logs
- Verify `DATABASE_URL` is set
- Run migrations: `npm run migrate:deploy` in Render shell

### Frontend can't connect to backend
- Verify `VITE_API_URL` matches backend URL exactly
- Check backend CORS settings
- Check backend is running (Render dashboard)

### Database errors
- Make sure migrations ran: `npm run migrate:deploy`
- Check database file permissions
- For PostgreSQL: verify connection string

---

## Next Steps

- [ ] Change default password after first login
- [ ] Set up custom domain (optional)
- [ ] Enable email notifications (future feature)
- [ ] Set up automated backups (if using PostgreSQL)
