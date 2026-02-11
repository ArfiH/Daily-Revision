import { Router } from 'express';
import {
  listPdfs,
  createPdfHandler,
  updatePdfHandler,
  deletePdfHandler,
} from '../controllers/pdfController';

const router = Router();
console.log('PDF routes are working');

router.get('/', listPdfs);
router.post('/', createPdfHandler);
router.put('/:id', updatePdfHandler);
router.delete('/:id', deletePdfHandler);

export default router;