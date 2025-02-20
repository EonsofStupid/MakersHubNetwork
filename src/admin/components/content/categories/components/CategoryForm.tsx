
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CategoryTreeItem } from '@/admin/types/content';

interface CategoryFormData {
  name: string;
  description?: string;
  parentId?: string;
}

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: CategoryTreeItem;
  title?: string;
}

export const CategoryForm = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title = 'Create Category',
}: CategoryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      parentId: initialData?.parent_id || undefined,
    },
  });

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="cyber-card border-primary/20">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add a new category to organize your content
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="relative group hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            >
              {initialData ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
