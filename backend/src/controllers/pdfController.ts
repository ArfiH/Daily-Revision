import { Request, Response } from 'express';
import {
  createPdf,
  getAllPdfs,
  getPdfById,
  updatePdf,
  deletePdf,
} from '../repositories/pdfRepository';
import { CreatePdfInput, UpdatePdfInput } from '../models/Pdf';
import { rebuildSchedule } from '../services/schedulerService';

export async function listPdfs(req: Request, res: Response) {
  try {
    const pdfs = await getAllPdfs();
    res.json(pdfs);
  } catch (error) {
    console.error('List PDFs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createPdfHandler(req: Request, res: Response) {
  try {
    const input: CreatePdfInput = req.body;
    if (!input.title || !input.totalPages || !input.targetEndDate) {
      return res.status(400).json({
        error: 'Title, totalPages, and targetEndDate are required',
      });
    }
    const pdf = await createPdf(input);
    const allPdfs = await getAllPdfs();
    await rebuildSchedule(allPdfs);
    res.status(201).json(pdf);
  } catch (error) {
    console.error('Create PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updatePdfHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const input: UpdatePdfInput = req.body;
    const existingPdf = await getPdfById(id);
    if (!existingPdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    await updatePdf(id, input);
    const allPdfs = await getAllPdfs();
    await rebuildSchedule(allPdfs);
    const updatedPdf = await getPdfById(id);
    res.json(updatedPdf);
  } catch (error) {
    console.error('Update PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deletePdfHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existingPdf = await getPdfById(id);
    if (!existingPdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    await deletePdf(id);
    const allPdfs = await getAllPdfs();
    await rebuildSchedule(allPdfs);
    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}