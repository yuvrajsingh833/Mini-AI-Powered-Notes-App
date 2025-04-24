'use client';

import { useAuth } from '@/context/AuthContext';
import NoteList from '@/components/notes/note-list';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Notes</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="with-summary">With Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NoteList />
        </TabsContent>
        <TabsContent value="favorites">
          <NoteList />
        </TabsContent>
        <TabsContent value="with-summary">
          <NoteList />
        </TabsContent>
      </Tabs>
    </div>
  );
}