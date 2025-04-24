'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { Note } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { summarizeText } from '@/lib/utils/api';

export function useNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all notes for the current user
  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['notes', user?.id, searchQuery],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Note[];
    },
    enabled: !!user,
  });

  // Create a new note
  const createNote = useMutation({
    mutationFn: async (newNote: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...newNote,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  // Update an existing note
  const updateNote = useMutation({
    mutationFn: async (updatedNote: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update(updatedNote)
        .eq('id', updatedNote.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['note', data.id] });
    },
  });

  // Delete a note
  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
      
      if (error) throw error;
      return noteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
    },
  });

  // Generate summary for a note
  const generateSummary = useCallback(async (noteId: string, content: string) => {
    try {
      const summary = await summarizeText(content);
      
      await updateNote.mutateAsync({
        id: noteId,
        summary,
      });
      
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }, [updateNote]);

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
    generateSummary,
    searchQuery,
    setSearchQuery,
  };
}