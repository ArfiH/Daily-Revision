import { Pdf } from '../../types';

interface PdfListProps {
  pdfs: Pdf[];
  onEdit: (pdf: Pdf) => void;
  onDelete: (id: string) => void;
}

export function PdfList({ pdfs, onEdit, onDelete }: PdfListProps) {
  if (pdfs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No PDFs added yet. Create your first PDF to get started!
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {pdfs.map((pdf) => {
          const progress = ((pdf.endPage - pdf.startPage + 1) / pdf.totalPages) * 100;
          return (
            <li key={pdf.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{pdf.title}</h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>
                      Pages {pdf.startPage}-{pdf.endPage} of {pdf.totalPages}
                    </span>
                    <span className="mx-2">•</span>
                    <span>Priority: {pdf.priority}/5</span>
                    <span className="mx-2">•</span>
                    <span>
                      Target: {new Date(pdf.targetEndDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  {pdf.externalUrl && (
                    <a
                      href={pdf.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Open
                    </a>
                  )}
                  <button
                    onClick={() => onEdit(pdf)}
                    className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(pdf.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
