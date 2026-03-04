'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Document } from '@/lib/types';

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    userId: 'student-1',
    name: 'alex-resume.pdf',
    type: 'resume',
    fileSize: 245000,
    uploadedAt: '2024-04-15',
    tags: ['resume', 'tech'],
    description: 'Updated resume with latest projects',
  },
  {
    id: 'doc-2',
    userId: 'student-1',
    name: 'internship-report.pdf',
    type: 'report',
    fileSize: 1250000,
    uploadedAt: '2024-05-10',
    tags: ['report', 'completed'],
    description: 'Final internship completion report',
  },
];

const initialState: DocumentsState = {
  documents: mockDocuments,
  loading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    uploadDocument: (state, action: PayloadAction<Document>) => {
      state.documents.push(action.payload);
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter((d) => d.id !== action.payload);
    },
    updateDocumentTags: (state, action: PayloadAction<{ documentId: string; tags: string[] }>) => {
      const doc = state.documents.find((d) => d.id === action.payload.documentId);
      if (doc) {
        doc.tags = action.payload.tags;
      }
    },
  },
});

export const { uploadDocument, deleteDocument, updateDocumentTags } = documentsSlice.actions;
export default documentsSlice.reducer;
