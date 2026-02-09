import { useState, useEffect } from 'react';
import { Pdf, CreatePdfInput, UpdatePdfInput } from '../../types';

interface PdfFormProps {
  pdf?: Pdf;
  onSubmit: (input: CreatePdfInput | UpdatePdfInput) => Promise<void>;
  onCancel: () => void;
}

export function PdfForm({ pdf, onSubmit, onCancel }: PdfFormProps) {
  const [title, setTitle] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [startPage, setStartPage] = useState('1');
  const [endPage, setEndPage] = useState('');
  const [targetEndDate, setTargetEndDate] = useState('');
  const [priority, setPriority] = useState('3');
  const [externalUrl, setExternalUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pdf) {
      setTitle(pdf.title);
      setTotalPages(pdf.totalPages.toString());
      setStartPage(pdf.startPage.toString());
      setEndPage(pdf.endPage.toString());
      setTargetEndDate(pdf.targetEndDate.split('T')[0]);
      setPriority(pdf.priority.toString());
      setExternalUrl(pdf.externalUrl || '');
    } else {
      // Set default target end date to 30 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setTargetEndDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [pdf]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const input: CreatePdfInput | UpdatePdfInput = {
        title,
        totalPages: parseInt(totalPages),
        startPage: parseInt(startPage),
        endPage: parseInt(endPage) || parseInt(totalPages),
        targetEndDate: new Date(targetEndDate).toISOString(),
        priority: parseInt(priority),
        externalUrl: externalUrl || undefined,
      };
      await onSubmit(input);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Pages</label>
          <input
            type="number"
            required
            min="1"
            value={totalPages}
            onChange={(e) => {
              setTotalPages(e.target.value);
              if (!endPage) setEndPage(e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Page</label>
          <input
            type="number"
            min="1"
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">End Page</label>
          <input
            type="number"
            min="1"
            value={endPage}
            onChange={(e) => setEndPage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Target End Date</label>
        <input
          type="date"
          required
          value={targetEndDate}
          onChange={(e) => setTargetEndDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">External URL (optional)</label>
        <input
          type="url"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="https://example.com/file.pdf"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : pdf ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
