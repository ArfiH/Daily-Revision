#!/bin/bash
# Bash script to fix database lock issues (for Git Bash/WSL)

echo "Checking for database lock issues..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Step 1: Check for running Node processes
echo ""
echo "Step 1: Checking for running Node processes..."
NODE_PIDS=$(pgrep node 2>/dev/null)
if [ -n "$NODE_PIDS" ]; then
    echo "Found Node processes running: $NODE_PIDS"
    echo "Stopping Node processes..."
    killall node 2>/dev/null || pkill node 2>/dev/null
    sleep 2
else
    echo "No Node processes found running"
fi

# Step 2: Remove lock files
echo ""
echo "Step 2: Removing SQLite lock files..."
rm -f dev.db-shm dev.db-wal dev.db-journal

# Step 3: Check if database exists
echo ""
echo "Step 3: Checking database file..."
if [ -f "dev.db" ]; then
    echo "Database file exists"
else
    echo "Database file does not exist (will be created)"
fi

# Step 4: Try to run migration
echo ""
echo "Step 4: Attempting to run migration..."
npm run migrate

echo ""
echo "Done!"
