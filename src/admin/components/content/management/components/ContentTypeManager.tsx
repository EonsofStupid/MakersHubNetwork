
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useCreateContentType } from '@/admin/queries/content/useContentTypes';
import { ContentType } from '@/admin/types/content';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';

interface ContentTypeManagerProps {
  contentTypes?: ContentType[];
}

export const ContentTypeManager = ({ contentTypes = [] }: ContentTypeManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: createContentType, isPending } = useCreateContentType();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (data: { name: string; description?: string }) => {
    createContentType(data);
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Content Types</h3>
        <Button onClick={handleOpenModal} disabled={isPending}>
          <Plus className="w-4 h-4 mr-2" />
          Add Content Type
        </Button>
      </div>

      {contentTypes.length > 0 ? (
        <ul>
          {contentTypes.map((type) => (
            <li key={type.id} className="py-2 border-b last:border-b-0">
              {type.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No content types created yet.</p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Content Type</DialogTitle>
          </DialogHeader>
          <ContentTypeModal
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ContentTypeModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  isPending?: boolean;
}

const ContentTypeModal = ({ onClose, onSubmit, isPending }: ContentTypeModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
