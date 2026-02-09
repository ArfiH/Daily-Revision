#!/bin/bash
# Build script for production deployment

echo "Building PDF Revision Scheduler for production..."

# Build backend
echo "Building backend..."
cd backend
npm install
npm run build
npm run generate
echo "Backend build complete!"

# Build frontend
echo "Building frontend..."
cd ../frontend
npm install
npm run build
echo "Frontend build complete!"

echo ""
echo "✅ Build complete!"
echo ""
echo "Backend: backend/dist/"
echo "Frontend: frontend/dist/"
echo ""
echo "Next steps:"
echo "1. Set up environment variables (see .env.production.example files)"
echo "2. Deploy backend and frontend to your chosen platform"
echo "3. See DEPLOYMENT.md for detailed instructions"
