'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, LayoutGrid, LayoutList, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import NoteCard from '@/components/notes/note-card';
import { Note } from '@/lib/types';
import { useNotes } from '@/hooks/useNotes';

export default function NoteList() {
  const {
    notes,
    isLoading,
    error,
    deleteNote,
    updateNote,
    generateSummary,
    searchQuery,
    setSearchQuery,
  } = useNotes();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleDelete = async (id: string) => {
    try {
      await deleteNote.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleFavorite = async (id: string, isFavorited: boolean) => {
    try {
      await updateNote.mutateAsync({
        id,
        is_favorited: isFavorited,
      });
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  // Sort notes with favorited ones first
  const sortedNotes = [...(notes || [])].sort((a, b) => {
    if (a.is_favorited && !b.is_favorited) return -1;
    if (!a.is_favorited && b.is_favorited) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive">Error loading notes. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button asChild>
            <Link href="/notes/new">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
        </div>
      </div>

      {sortedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No notes yet</h3>
          <p className="mt-2 text-muted-foreground">Create your first note to get started.</p>
          <Button className="mt-4" asChild>
            <Link href="/notes/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Link>
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "flex flex-col space-y-3"
        }>
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onFavorite={handleFavorite}
              onGenerateSummary={generateSummary}
            />
          ))}
        </div>
      )}
    </div>
  );
}