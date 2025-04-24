'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Sparkles, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/lib/types';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required.',
  }),
  content: z.string().min(1, {
    message: 'Content is required.',
  }),
});

interface NoteEditorProps {
  note?: Note;
  isCreating?: boolean;
  onSave: (note: { title: string; content: string }) => Promise<void>;
  onGenerateSummary?: (id: string, content: string) => Promise<string>;
}

export default function NoteEditor({
  note,
  isCreating = false,
  onSave,
  onGenerateSummary,
}: NoteEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
    },
  });

  // Update form values when note changes
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
      });
    }
  }, [note, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await onSave(values);
      
      toast.success(isCreating ? 'Note created successfully!' : 'Note updated successfully!');
      
      if (isCreating) {
        router.push('/notes');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(isCreating ? 'Failed to create note' : 'Failed to update note');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateSummary() {
    if (!note || !onGenerateSummary) return;
    
    try {
      setIsGeneratingSummary(true);
      const summary = await onGenerateSummary(note.id, form.getValues().content);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Summary error:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {!isCreating && onGenerateSummary && (
          <Button
            variant="outline"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
          </Button>
        )}
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Note title"
                    {...field}
                    className="text-xl font-semibold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your note here..."
                    className="min-h-[300px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {note?.summary && (
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2 font-medium">
                <Sparkles className="h-5 w-5" />
                <span>AI Summary</span>
              </div>
              <p>{note.summary}</p>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading
              ? isCreating ? 'Creating...' : 'Saving...'
              : isCreating ? 'Create Note' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
}