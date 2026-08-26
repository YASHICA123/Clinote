import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import type { ClinicalDocument, Encounter } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { 
  FileText, 
  Plus, 
  Lock, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertCircle, 
  X, 
  Printer 
} from 'lucide-react';

interface DocumentsTabProps {
  patientId: string;
  encounters: Encounter[];
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ patientId, encounters }) => {
  const [documents, setDocuments] = useState<ClinicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<ClinicalDocument | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editor form state
  const [docType, setDocType] = useState('DISCHARGE_SUMMARY');
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocumentsByPatient(patientId);
      setDocuments(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      } else if (selectedDoc) {
        const updated = data.find(d => d.id === selectedDoc.id);
        if (updated) setSelectedDoc(updated);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [patientId]);

  const handleStartCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setDocType('DISCHARGE_SUMMARY');
    setDocTitle('Discharge Summary');
    setDocContent(
`HOSPITAL COURSE:
Patient admitted for ... Responded favorably to therapy.

DISCHARGE DIAGNOSES:
1. 

DISCHARGE MEDICATIONS:
1. 

FOLLOW-UP & INSTRUCTIONS:
- Clinic follow-up in 1-2 weeks.`
    );
    setError(null);
  };

  const handleStartEdit = (doc: ClinicalDocument) => {
    if (doc.status === 'FINAL') return;
    setIsEditing(true);
    setIsCreating(false);
    setDocTitle(doc.title);
    setDocContent(doc.content);
    setDocType(doc.document_type);
    setError(null);
  };

  const handleSaveDocument = async () => {
    if (!docTitle.trim() || !docContent.trim()) {
      setError('Title and content are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isCreating) {
        const activeEnc = encounters.find(e => e.status === 'ACTIVE');
        const created = await documentService.createDocument({
          patient_id: patientId,
          encounter_id: activeEnc?.id,
          document_type: docType,
          title: docTitle.trim(),
          content: docContent.trim(),
          status: 'DRAFT'
        });
        setIsCreating(false);
        await fetchDocs();
        setSelectedDoc(created);
      } else if (isEditing && selectedDoc) {
        const updated = await documentService.updateDocument(selectedDoc.id, {
          title: docTitle.trim(),
          content: docContent.trim(),
          document_type: docType
        });
        setIsEditing(false);
        await fetchDocs();
        setSelectedDoc(updated);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to save document.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async (docId: string) => {
    if (!window.confirm('Are you sure you want to finalize this clinical document? Finalized documents become permanent and immutable.')) {
      return;
    }

    setSaving(true);
    try {
      const finalized = await documentService.finalizeDocument(docId);
      await fetchDocs();
      setSelectedDoc(finalized);
    } catch (err: any) {
      alert(err?.response?.data?.detail || err?.message || 'Failed to finalize document');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading clinical documents..." />;

  return (
    <div className="space-y-6 text-left">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Clinical Documents</h3>
          <p className="text-xs text-slate-400">Manage draft and finalized clinical records</p>
        </div>
        <Button
          onClick={handleStartCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus size={16} />
          New Document
        </Button>
      </div>

      {/* Main Grid: Document list on left, Document viewer/editor on right */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Document List */}
        <div className="lg:col-span-4 space-y-3">
          {documents.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 space-y-2 border-dashed">
              <FileText size={28} className="mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No documents created yet</p>
              <Button onClick={handleStartCreate} className="text-xs text-blue-600 hover:underline">
                Create First Document
              </Button>
            </Card>
          ) : (
            documents.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;
              const isFinal = doc.status === 'FINAL';

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/10 shadow-sm'
                      : 'bg-white hover:bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-800 leading-snug">{doc.title}</h4>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                        isFinal
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isFinal ? <Lock size={10} /> : <Edit3 size={10} />}
                      {doc.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.content}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <User size={10} />
                      {doc.created_by}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(doc.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Document Editor or Viewer */}
        <div className="lg:col-span-8">
          {isCreating || isEditing ? (
            /* Document Editor Card */
            <Card className="p-6 space-y-5 border-blue-200 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                    <Edit3 size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isCreating ? 'Create New Clinical Document' : 'Edit Draft Document'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-800"
                  >
                    <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
                    <option value="CONSULTATION_NOTE">Consultation Note</option>
                    <option value="INITIAL_ASSESSMENT">Initial Admission Assessment</option>
                    <option value="PROCEDURE_NOTE">Procedure / Operative Note</option>
                    <option value="REFERRAL_LETTER">Referral Letter</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Document Title</label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Discharge Summary - Pneumonia Resolution"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Document Content</label>
                <textarea
                  rows={14}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full font-mono text-xs p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none leading-relaxed text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSaveDocument}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </Button>
              </div>
            </Card>
          ) : selectedDoc ? (
            /* Document Previewer Card */
            <Card className="p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">{selectedDoc.title}</h3>
                    <span
                      className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                        selectedDoc.status === 'FINAL'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {selectedDoc.status === 'FINAL' ? <Lock size={10} /> : <Edit3 size={10} />}
                      {selectedDoc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Author: <span className="font-semibold text-slate-600">{selectedDoc.created_by}</span> • Created: {new Date(selectedDoc.created_at).toLocaleString()}
                    {selectedDoc.finalized_at && (
                      <span> • Finalized by {selectedDoc.finalized_by} on {new Date(selectedDoc.finalized_at).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedDoc.status === 'DRAFT' && (
                    <>
                      <button
                        onClick={() => handleStartEdit(selectedDoc)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 size={14} />
                        Edit Draft
                      </button>
                      <button
                        onClick={() => handleFinalize(selectedDoc.id)}
                        disabled={saving}
                        className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <CheckCircle2 size={14} />
                        Finalize Document
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl"
                    title="Print Document"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>

              {/* Formatted Document Content */}
              <div className="p-6 bg-slate-50/70 border border-slate-100 rounded-2xl">
                <pre className="font-sans text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedDoc.content}
                </pre>
              </div>

              {selectedDoc.status === 'FINAL' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <Lock size={14} className="shrink-0 text-emerald-600" />
                  <span>This document is finalized and legally locked from further modifications.</span>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 space-y-2 border-dashed">
              <FileText size={32} className="mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Select a document to preview or create a new one.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
