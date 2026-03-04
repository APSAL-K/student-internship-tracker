'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { uploadDocument, deleteDocument, updateDocumentTags } from '@/store/slices/documentsSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Download, Trash2, Plus, X } from 'lucide-react';
import { useState, useRef } from 'react';

const docTypeColors: { [key: string]: string } = {
  resume: 'bg-blue-500/20 text-blue-300',
  certificate: 'bg-green-500/20 text-green-300',
  letter: 'bg-purple-500/20 text-purple-300',
  report: 'bg-orange-500/20 text-orange-300',
  other: 'bg-gray-500/20 text-gray-300',
};

export default function DocumentsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { documents } = useAppSelector((state) => state.documents);
  const [dragActive, setDragActive] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocuments = documents.filter((d) => d.userId === user?.id);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const doc = {
        id: `doc-${Date.now()}-${Math.random()}`,
        userId: user?.id || '',
        name: file.name,
        type: ('other' as const),
        fileSize: file.size,
        uploadedAt: new Date().toISOString().split('T')[0],
        tags: [],
        description: '',
      };
      dispatch(uploadDocument(doc));
    });
  };

  const handleDelete = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      dispatch(deleteDocument(docId));
    }
  };

  const handleAddTag = (docId: string) => {
    if (newTag.trim()) {
      const doc = userDocuments.find((d) => d.id === docId);
      if (doc) {
        dispatch(
          updateDocumentTags({
            documentId: docId,
            tags: [...doc.tags, newTag.trim()],
          })
        );
        setNewTag('');
      }
    }
  };

  const handleRemoveTag = (docId: string, tag: string) => {
    const doc = userDocuments.find((d) => d.id === docId);
    if (doc) {
      dispatch(
        updateDocumentTags({
          documentId: docId,
          tags: doc.tags.filter((t) => t !== tag),
        })
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Documents</h1>
          <p className="text-foreground/60">Upload and manage your internship documents</p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
            dragActive ? 'border-primary bg-primary/10' : 'border-border bg-card/50'
          }`}
        >
          <Upload className="w-12 h-12 text-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Drag and drop your documents</h3>
          <p className="text-foreground/60 mb-4">or</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-primary to-accent text-foreground font-semibold rounded-lg"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <p className="text-xs text-foreground/50 mt-4">Supports PDF, DOC, DOCX, and other document formats</p>
        </div>

        {userDocuments.length === 0 ? (
          <div className="text-center py-16 bg-card/50 rounded-2xl border border-border">
            <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-foreground/60">No documents uploaded yet</p>
            <p className="text-sm text-foreground/40 mt-2">Upload your resume, certificates, and other documents</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userDocuments.map((doc) => (
              <div key={doc.id} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 flex items-start gap-4">
                    <div className={`${docTypeColors[doc.type]} p-3 rounded-lg flex-shrink-0`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">{doc.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-foreground/60 mb-3">
                        <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <Badge variant="secondary" className={`${docTypeColors[doc.type]} text-xs border-0`}>
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                        </Badge>
                      </div>

                      {doc.description && (
                        <p className="text-sm text-foreground/70 mb-3">{doc.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {doc.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-primary/20 text-primary border-0 text-xs cursor-pointer hover:bg-primary/30 flex items-center gap-1"
                            onClick={() => handleRemoveTag(doc.id, tag)}
                          >
                            {tag}
                            <X className="w-3 h-3" />
                          </Badge>
                        ))}
                      </div>

                      {selectedDocId === doc.id && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new tag (e.g., 'reviewed')"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddTag(doc.id);
                              }
                            }}
                            className="bg-input border-border rounded-lg text-sm"
                          />
                          <Button
                            onClick={() => handleAddTag(doc.id)}
                            variant="outline"
                            className="border-border rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        setSelectedDocId(selectedDocId === doc.id ? null : doc.id)
                      }
                      className="p-2 hover:bg-card border border-border rounded-lg transition text-foreground/60 hover:text-foreground"
                      title="Add tag"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 hover:bg-card border border-border rounded-lg transition text-foreground/60 hover:text-foreground"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-destructive/20 border border-border rounded-lg transition text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
