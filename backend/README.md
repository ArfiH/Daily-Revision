# PDF Revision Scheduler - Backend

Backend API for the PDF revision scheduler application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

3. Generate Prisma client:
```bash
npm run generate
```

4. Run migrations:
```bash
npm run migrate
```

5. Seed initial user:
```bash
SEED_EMAIL=your@email.com SEED_PASSWORD=yourpassword npm run seed
```

6. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### PDFs ()
- `GET /api/pdfs` - List all PDFs
- `POST /api/pdfs` - Create new PDF
- `PUT /api/pdfs/:id` - Update PDF
- `DELETE /api/pdfs/:id` - Delete PDF

### Schedule ()
- `POST /api/schedule/rebuild` - Rebuild schedule from PDFs
- `GET /api/schedule/today` - Get today's schedule entries
- `GET /api/schedule/range?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get schedule for date range
- `PATCH /api/schedule/:id` - Update schedule entry status
