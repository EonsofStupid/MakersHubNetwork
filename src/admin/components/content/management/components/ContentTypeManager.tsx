import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreateContentType } from '@/admin/queries/content/useContentTypes';
import { ContentType } from '@/admin/types/content';

interface ContentTypeManagerProps {
  contentTypes: ContentType[];
}

export const ContentTypeManager = ({ contentTypes }: ContentTypeManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: createContentType, isLoading } = useCreateContentType();

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
        <Button onClick={handleOpenModal} disabled={isLoading}>
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

      {isModalOpen && (
        <ContentTypeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

interface ContentTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  isLoading?: boolean;
}

const ContentTypeModal = ({ isOpen, onClose, onSubmit, isLoading }: ContentTypeModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h4 className="text-lg font-semibold mb-4">Add New Content Type</h4>
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
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
