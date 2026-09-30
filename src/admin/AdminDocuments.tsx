import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Eye,
  X,
  UserCheck,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface DocumentItem {
  id: number;
  studentId: number;
  studentName: string;
  category: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  notes: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const DOCUMENT_CATEGORIES = [
  'Passport',
  'Transcripts',
  'Certificates',
  'IELTS / Language Scores',
  'Statement of Purpose (SOP)',
  'Recommendation Letters (LOR)',
  'Financial Documents',
  'Visa Documents',
];

export const AdminDocuments: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Preview & Verification Modal
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'Pending' | 'Under Review' | 'Verified' | 'Rejected'>('Verified');
  const [verifyNotes, setVerifyNotes] = useState('');

  // Upload Document Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formStudentId, setFormStudentId] = useState('');
  const [formCategory, setFormCategory] = useState('Transcripts');
  const [formTitle, setFormTitle] = useState('');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/documents', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
      const stuRes = await fetch('/api/admin/students', { headers: getAuthHeaders() });
      if (stuRes.ok) setStudents(await stuRes.json());
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleUpdateVerification = async () => {
    if (!activeDoc) return;
    try {
      const res = await fetch(`/api/admin/documents/${activeDoc.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: verifyStatus,
          notes: verifyNotes || activeDoc.notes,
          verifiedBy: user.name,
          verifiedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDocuments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        setActiveDoc(null);
        setVerifyNotes('');
      }
    } catch (err) {
      console.error('Error updating document status:', err);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedStudent = students.find((s) => s.id === Number(formStudentId));
    if (!matchedStudent) return;

    try {
      const newDoc = {
        studentId: matchedStudent.id,
        studentName: matchedStudent.fullName,
        category: formCategory,
        title: formTitle,
        fileUrl: formFileUrl || 'https://example.com/uploads/document.pdf',
        fileType: 'application/pdf',
        fileSize: '1.8 MB',
        status: 'Under Review',
        notes: formNotes || null,
      };

      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newDoc),
      });

      if (res.ok) {
        const created = await res.json();
        setDocuments((prev) => [created, ...prev]);
        setIsUploadModalOpen(false);
        setFormTitle('');
        setFormFileUrl('');
        setFormNotes('');
      }
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  const filteredDocs = documents.filter((d) => {
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && d.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.studentName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Student Document Repository</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredDocs.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verification workflow for Passports, Academic Certificates, IELTS TRF, Financial Statements & Visas.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New File</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student or document title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Document Categories</option>
            {DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Document Title</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">File Specs</th>
                <th className="px-4 py-3">Verification Status</th>
                <th className="px-4 py-3">Audit Details</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No documents matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                    onClick={() => {
                      setActiveDoc(doc);
                      setVerifyStatus(doc.status);
                      setVerifyNotes(doc.notes || '');
                    }}
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                      {doc.notes && (
                        <div className="text-[10px] text-amber-400/90 font-normal pl-6 mt-0.5 truncate max-w-sm">
                          Note: {doc.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium">
                      {doc.studentName}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-medium">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">
                      {doc.fileType} • {doc.fileSize}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status === 'Verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : doc.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">
                      {doc.verifiedBy ? (
                        <div>
                          <div>By: <span className="text-slate-200 font-medium">{doc.verifiedBy}</span></div>
                          <div className="text-[10px] text-slate-500">{new Date(doc.verifiedAt || doc.updatedAt).toLocaleDateString()}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Unverified</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setActiveDoc(doc);
                          setVerifyStatus(doc.status);
                          setVerifyNotes(doc.notes || '');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-xs transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFY / PREVIEW MODAL */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Review & Verify Document</h3>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{activeDoc.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {activeDoc.category}
                  </span>
                </div>
                <div className="text-slate-300">Student: <span className="font-semibold text-white">{activeDoc.studentName}</span></div>
                <div className="text-[11px] text-slate-400">
                  Size: {activeDoc.fileSize} • Uploaded: {new Date(activeDoc.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Verification Status</label>
                <select
                  value={verifyStatus}
                  onChange={(e) => setVerifyStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified (Compliant)</option>
                  <option value="Rejected">Rejected (Incomplete / Blur / Invalid)</option>
                  <option value="Pending">Pending Student Re-upload</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Verification Feedback & Defect Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bank statement lacks 28-day continuous maturity seal. Need formal branch manager signature and conversion rate letter."
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <a
                  href={activeDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Document Preview</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveDoc(null)}
                    className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateVerification}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                  >
                    Save Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Upload Student Document</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Student *</label>
                <select
                  required
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Category *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  {DOCUMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official University Bachelor Transcript"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Document Cloud Storage / Direct URL</label>
                <input
                  type="text"
                  placeholder="https://storage.googleapis.com/.../doc.pdf"
                  value={formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notary attestation checked, translated by certified court translator..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
