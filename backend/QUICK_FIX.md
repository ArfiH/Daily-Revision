# Quick Fix for Database Lock Error

## Method 1: Use the Fix Script (Windows PowerShell)

Run this command in the backend directory:
```powershell
.\fix-db-lock.ps1
```

Or use npm:
```bash
npm run fix-db
```

## Method 2: Manual Steps

### Step 1: Stop ALL Node Processes
```powershell
# In PowerShell (run as Administrator if needed):
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 2: Remove Lock Files
```powershell
cd backend
Remove-Item dev.db-shm -ErrorAction SilentlyContinue
Remove-Item dev.db-wal -ErrorAction SilentlyContinue
Remove-Item dev.db-journal -ErrorAction SilentlyContinue
```

### Step 3: Delete Database and Start Fresh
```powershell
cd backend
Remove-Item dev.db -ErrorAction SilentlyContinue
npm run migrate
```

## Method 3: Use Absolute Path (Alternative)

If relative paths are causing issues, try updating `.env`:

```env
DATABASE_URL="file:E:/Arfi/Web Practice/Daily-Revision/backend/dev.db"
```

Then run:
```bash
npm run migrate
```

## Method 4: Check for File Permissions

Make sure you have write permissions in the backend directory:
```powershell
# Check current directory permissions
Get-Acl . | Format-List
```

## Still Not Working?

1. **Close ALL terminals and VS Code/Cursor**
2. **Restart your computer** (this clears all file locks)
3. **Open a fresh terminal**
4. **Navigate to backend directory**
5. **Run: `npm run migrate`**

## Alternative: Use Prisma Migrate Deploy

If `migrate dev` keeps failing, try:
```bash
npm run generate
npx prisma migrate deploy
```
