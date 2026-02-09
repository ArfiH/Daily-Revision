import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createPdf,
  getPdfsByUserId,
  getPdfById,
  updatePdf,
  deletePdf,
} from '../repositories/pdfRepository';
import { CreatePdfInput, UpdatePdfInput } from '../models/Pdf';
import { rebuildSchedule } from '../services/schedulerService';
import { getPdfsByUserId as getAllPdfs } from '../repositories/pdfRepository';

export async function listPdfs(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const pdfs = await getPdfsByUserId(userId);
    res.json(pdfs);
  } catch (error) {
    console.error('List PDFs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createPdfHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const input: CreatePdfInput = req.body;

    if (!input.title || !input.totalPages || !input.targetEndDate) {
      return res.status(400).json({
        error: 'Title, totalPages, and targetEndDate are required',
      });
    }

    const pdf = await createPdf(userId, input);

    // Rebuild schedule after adding PDF
    const allPdfs = await getAllPdfs(userId);
    await rebuildSchedule(userId, allPdfs);

    res.status(201).json(pdf);
  } catch (error) {
    console.error('Create PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updatePdfHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const input: UpdatePdfInput = req.body;

    const existingPdf = await getPdfById(id, userId);
    if (!existingPdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    await updatePdf(id, userId, input);

    // Rebuild schedule after updating PDF
    const allPdfs = await getAllPdfs(userId);
    await rebuildSchedule(userId, allPdfs);

    const updatedPdf = await getPdfById(id, userId);
    res.json(updatedPdf);
  } catch (error) {
    console.error('Update PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deletePdfHandler(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const existingPdf = await getPdfById(id, userId);
    if (!existingPdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    await deletePdf(id, userId);

    // Rebuild schedule after deleting PDF
    const allPdfs = await getAllPdfs(userId);
    await rebuildSchedule(userId, allPdfs);

    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
