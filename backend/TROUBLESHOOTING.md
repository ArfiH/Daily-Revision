# Troubleshooting Guide

## Database Locked Error

If you get `Error: SQLite database error - database is locked`, follow these steps:

### Step 1: Stop All Running Processes
1. **Stop the backend dev server** if it's running:
   - Press `Ctrl+C` in the terminal where `npm run dev` is running
   - Or close the terminal window

2. **Check for other Node processes**:
   ```bash
   # On Windows PowerShell:
   Get-Process node | Stop-Process -Force
   
   # Or check manually:
   tasklist | findstr node
   ```

### Step 2: Remove Lock Files (if they exist)
SQLite sometimes leaves lock files. Check for:
- `dev.db-shm` (shared memory file)
- `dev.db-wal` (write-ahead log file)

If these exist in the `backend` directory, you can safely delete them:
```bash
cd backend
del dev.db-shm 2>$null
del dev.db-wal 2>$null
```

### Step 3: Try Migration Again
```bash
cd backend
npm run migrate
```

### Step 4: If Still Locked - Reset Database (⚠️ WARNING: Deletes all data)
Only do this if you don't have important data:
```bash
cd backend
# Delete the database file
del dev.db
# Run migration again
npm run migrate
```

## Prevention

To avoid this issue:
1. **Always stop the dev server** before running migrations
2. **Don't run multiple migrations simultaneously**
3. **Close database connections properly** (already implemented in the code)

## Alternative: Use Prisma Studio Safely

If you need to view/edit data while the server is running:
1. Use Prisma Studio in a separate terminal: `npx prisma studio`
2. This uses a different connection method and shouldn't cause locks
