# PDF Revision Scheduler

A web application to help you schedule and track PDF page revisions over a month. The app automatically generates a daily schedule to help you cover all pages of your PDFs by a target date.

## Features

- **PDF Management**: Add PDFs with metadata (title, total pages, target end date, priority)
- **Automatic Scheduling**: The app automatically generates a daily schedule to distribute pages across your target timeframe
- **Daily Dashboard**: View today's revision tasks with completion tracking
- **Schedule Overview**: See your upcoming schedule for the next 14 days
- **Cross-device Access**: Access your schedule from desktop and mobile browsers

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma + SQLite

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env` file):
   ```env
   PORT=3001
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-change-in-production"
   CORS_ORIGIN="http://localhost:5173"
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Seed initial user (optional):
   ```bash
   npm run seed
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create `.env` file):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Usage

1. **Login**: Use the credentials from the seeded user (or create one via the seed script)
2. **Add PDFs**: Go to the PDFs page and add your PDFs with:
   - Title
   - Total pages
   - Start and end page range (if not covering the entire PDF)
   - Target end date
   - Priority (1-5)
   - Optional external URL to the PDF file
3. **View Schedule**: The app automatically generates a schedule when you add/update PDFs
4. **Daily Revision**: Check the Dashboard to see today's assigned pages
5. **Track Progress**: Mark pages as done or skipped as you complete them

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (env, db)
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/          # Type definitions
│   │   ├── repositories/    # Database access layer
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic (scheduler)
│   │   └── utils/           # Utilities (password hashing)
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # React components
│   │   ├── context/         # React context (auth)
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   └── package.json
└── README.md
```

## API Endpoints

### Auth
- `POST /auth/login` - Login and get JWT token

### PDFs
- `GET /api/pdfs` - List all PDFs for the authenticated user
- `POST /api/pdfs` - Create a new PDF
- `PUT /api/pdfs/:id` - Update a PDF
- `DELETE /api/pdfs/:id` - Delete a PDF

### Schedule
- `POST /api/schedule/rebuild` - Rebuild schedule from current PDFs
- `GET /api/schedule/today` - Get today's schedule entries and overdue items
- `GET /api/schedule/range?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get schedule entries for a date range
- `PATCH /api/schedule/:id` - Update schedule entry status (done/skipped/pending)

## Scheduling Algorithm

The scheduler distributes pages across the available days between the start date and target end date:

1. Calculates the number of days available for each PDF
2. Computes pages per day: `ceil(totalPages / days)`
3. Assigns page ranges to each day
4. Combines entries from all PDFs for each day
5. Normalizes days that exceed the maximum pages threshold (40 pages/day)

## Development

- Backend uses `tsx` for TypeScript execution in development
- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Both projects use TypeScript for type safety

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**
- **Render** (Free tier): See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **Vercel** (Frontend) + **Render/Railway** (Backend)
- **Self-hosted** VPS with PM2 + Nginx

### Production Build

**Backend:**
```bash
cd backend
npm install
npm run build
npm run generate
npm run migrate:deploy
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Output in frontend/dist/
```

## License

ISC
