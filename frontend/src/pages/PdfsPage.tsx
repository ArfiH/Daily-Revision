import { useState, useEffect } from 'react';
import { pdfApi } from '../api/pdfApi';
import { Pdf, CreatePdfInput, UpdatePdfInput } from '../types';
import { PdfList } from '../components/pdfs/PdfList';
import { PdfForm } from '../components/pdfs/PdfForm';

export function PdfsPage() {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPdf, setEditingPdf] = useState<Pdf | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadPdfs = async () => {
    try {
      setLoading(true);
      const data = await pdfApi.list();
      setPdfs(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load PDFs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPdfs();
  }, []);

  const handleCreate = async (input: CreatePdfInput) => {
    try {
      await pdfApi.create(input);
      await loadPdfs();
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create PDF');
      throw err;
    }
  };

  const handleUpdate = async (input: UpdatePdfInput) => {
    if (!editingPdf) return;
    try {
      await pdfApi.update(editingPdf.id, input);
      await loadPdfs();
      setEditingPdf(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update PDF');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this PDF?')) return;
    try {
      await pdfApi.delete(id);
      await loadPdfs();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete PDF');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PDFs</h1>
          <p className="mt-2 text-gray-600">Manage your PDFs and revision schedule</p>
        </div>
        {!showForm && !editingPdf && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add PDF
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <PdfForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingPdf && (
        <PdfForm
          pdf={editingPdf}
          onSubmit={handleUpdate}
          onCancel={() => setEditingPdf(null)}
        />
      )}

      <PdfList
        pdfs={pdfs}
        onEdit={setEditingPdf}
        onDelete={handleDelete}
      />
    </div>
  );
}
