
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateContentType } from '@/admin/queries/content/useContentTypes';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContentTypeForm {
  name: string;
  description?: string;
}

export const ContentTypeManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const createMutation = useCreateContentType();
  const form = useForm<ContentTypeForm>();

  const onSubmit = async (data: ContentTypeForm) => {
    await createMutation.mutateAsync(data);
    setIsOpen(false);
    form.reset();
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur" />
        <Plus className="w-4 h-4 mr-2" />
        New Type
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="cyber-card border-primary/20">
          <DialogHeader>
            <DialogTitle>Create Content Type</DialogTitle>
            <DialogDescription>
              Add a new type of content to manage in the CMS.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...form.register('name', { required: true })}
                className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              >
                Create Type
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
