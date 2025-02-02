import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageContentSchema } from '../types/contentTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditorCore from '../blog/components/editor/EditorCore';
import { RevisionCompare } from '../version-control';
import { History } from 'lucide-react';
import type { PageContent } from '../types/contentTypes';

interface PageContentFormProps {
  initialData?: Partial<PageContent>;
  onSubmit: (data: PageContent) => void;
}

const PageContentForm: React.FC<PageContentFormProps> = ({ initialData, onSubmit }) => {
  const [showVersions, setShowVersions] = useState(false);

  const form = useForm<PageContent>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      type: 'page',
      title: initialData?.title || '',
      content: {
        body: initialData?.content?.body || '',
        seo: initialData?.content?.seo || {},
      },
      status: initialData?.status || 'draft',
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1 mr-4">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/5 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {initialData?.id && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowVersions(true)}
                className="self-end"
              >
                <History className="w-4 h-4 mr-2" />
                Compare Versions
              </Button>
            )}
          </div>

          <FormField
            control={form.control}
            name="content.body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <EditorCore content={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
          >
            Save Page
          </Button>
        </form>
      </Form>

      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent className="max-w-7xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Version Comparison</DialogTitle>
          </DialogHeader>
          {initialData?.id && (
            <RevisionCompare 
              contentId={initialData.id} 
              currentVersion={initialData.version}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PageContentForm;