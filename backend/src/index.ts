import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import pdfRoutes from './routes/pdfRoutes';
import scheduleRoutes from './routes/scheduleRoutes';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

app.use('/api/pdfs', pdfRoutes);
app.use('/api/schedule', scheduleRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});