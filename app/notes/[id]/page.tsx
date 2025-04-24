'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import NoteEditor from '@/components/notes/note-editor';
import { useNotes } from '@/hooks/useNotes';
import supabase from '@/lib/supabase';
import { Note } from '@/lib/types';
import { toast } from 'sonner';

export default function EditNotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { updateNote, generateSummary } = useNotes();

  // Fetch the specific note
  const { data: note, isLoading: isNoteLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      if (!user || !id) return null;
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    enabled: !!user && !!id,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleUpdateNote = async (updatedNote: { title: string; content: string }) => {
    try {
      if (!note) return;
      
      await updateNote.mutateAsync({
        id: note.id,
        ...updatedNote,
      });
      
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isNoteLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-bold mb-2">Note not found</h1>
          <p className="text-muted-foreground mb-4">The note you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            className="text-primary hover:underline"
            onClick={() => router.push('/notes')}
          >
            Go back to notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Note</h1>
      <NoteEditor
        note={note}
        onSave={handleUpdateNote}
        onGenerateSummary={generateSummary}
      />
    </div>
  );
}