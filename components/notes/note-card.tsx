'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Star,
  Trash2,
  MoreVertical,
  Edit,
  Sparkles,
  StarOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Note } from '@/lib/types';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onFavorite: (id: string, isFavorited: boolean) => void;
  onGenerateSummary: (id: string, content: string) => Promise<string>;
}

export default function NoteCard({ note, onDelete, onFavorite, onGenerateSummary }: NoteCardProps) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const formattedDate = format(new Date(note.updated_at), 'MMM d, yyyy');
  
  const handleDelete = () => {
    onDelete(note.id);
    toast.success('Note deleted successfully');
  };

  const handleFavorite = () => {
    onFavorite(note.id, !note.is_favorited);
    toast.success(note.is_favorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleGenerateSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      await onGenerateSummary(note.id, note.content);
      toast.success('Summary generated successfully');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Truncate content for preview
  const previewContent = note.content.length > 150
    ? `${note.content.substring(0, 150)}...`
    : note.content;

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-xl font-semibold line-clamp-1">{note.title}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className="h-8 w-8"
          >
            {note.is_favorited ? (
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
            <span className="sr-only">
              {note.is_favorited ? 'Remove from favorites' : 'Add to favorites'}
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/notes/${note.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>{isGeneratingSummary ? 'Generating...' : 'Generate Summary'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground whitespace-pre-line">{previewContent}</p>
        {note.summary && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2 mb-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI Summary</span>
            </div>
            <p className="text-sm">{note.summary}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" asChild className="w-full">
          <Link href={`/notes/${note.id}`}>View Note</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}