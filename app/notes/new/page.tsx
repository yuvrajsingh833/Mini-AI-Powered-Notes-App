'use client';

import { useAuth } from '@/context/AuthContext';
import NoteEditor from '@/components/notes/note-editor';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { toast } from 'sonner';

export default function NewNotePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { createNote } = useNotes();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleCreateNote = async (note: { title: string; content: string }) => {
    try {
      await createNote.mutateAsync({
        ...note,
        is_favorited: false,
      });
      router.push('/notes');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create New Note</h1>
      <NoteEditor isCreating onSave={handleCreateNote} />
    </div>
  );
}