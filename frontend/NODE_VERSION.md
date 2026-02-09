# Node.js Version Requirements

## Current Issue

You're using **Node.js 16.20.2**, but the project requires **Node.js 18+** (ideally **Node.js 20+**).

## Recommended Solution: Upgrade Node.js

### Option 1: Using nvm (Node Version Manager) - Recommended

1. **Install nvm-windows** (if not already installed):
   - Download from: https://github.com/coreybutler/nvm-windows/releases
   - Install the `nvm-setup.exe` file

2. **Install Node.js 20 LTS**:
   ```powershell
   nvm install 20
   nvm use 20
   ```

3. **Verify installation**:
   ```powershell
   node --version  # Should show v20.x.x
   ```

4. **Reinstall dependencies**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Option 2: Direct Download

1. **Download Node.js 20 LTS** from: https://nodejs.org/
2. **Install** the Windows installer
3. **Restart** your terminal/IDE
4. **Verify**: `node --version`
5. **Reinstall dependencies** in both frontend and backend folders

## Temporary Workaround (Current Setup)

I've downgraded packages to versions that *might* work with Node 16, but you'll still see warnings and may encounter issues. The packages are:

- Vite: `^5.0.8` (instead of 7.3.1)
- React Router: `^6.20.0` (instead of 7.13.0)
- React: `^18.2.0` (instead of 19.2.0)

**However, Vite 5 still requires Node 18+**, so you may still encounter issues.

## Why Upgrade?

- **Security**: Node 16 is no longer supported (EOL)
- **Compatibility**: Modern tools require newer Node versions
- **Performance**: Newer Node versions are faster
- **Features**: Access to latest JavaScript features

## Check Your Node Version

```bash
node --version
```

If it shows `v16.x.x`, you need to upgrade.
