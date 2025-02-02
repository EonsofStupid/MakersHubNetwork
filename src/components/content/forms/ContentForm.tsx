import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import ContentTypeSelector from './ContentTypeSelector';
import PageContentForm from './PageContentForm';
import ComponentContentForm from './ComponentContentForm';
import { useContent } from '../hooks/useContent';
import { toast } from 'sonner';
import type { ContentType, PageContent, ComponentContent } from '../types/contentTypes';

interface ContentFormProps {
  initialType?: ContentType;
  contentId?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({ initialType = 'page', contentId }) => {
  const [contentType, setContentType] = useState<ContentType>(initialType);
  const { content, createContent, updateContent, isLoading } = useContent(contentId);

  const handleSubmit = async (data: PageContent | ComponentContent) => {
    try {
      if (!data.title) {
        toast.error('Title is required');
        return;
      }

      // Ensure content type is properly set based on form type
      const contentData = {
        ...data,
        type: contentType,
        title: data.title,
        metadata: data.metadata || {},
        status: data.status || 'draft',
        content: contentType === 'page' 
          ? { body: (data as PageContent).content?.body || '', seo: (data as PageContent).content?.seo || {} }
          : { 
              componentType: (data as ComponentContent).content?.componentType || '',
              props: (data as ComponentContent).content?.props || {},
              styles: (data as ComponentContent).content?.styles || {}
            }
      };

      if (contentId) {
        await updateContent.mutateAsync({ 
          id: contentId, 
          ...contentData
        });
        toast.success('Content updated successfully');
      } else {
        await createContent.mutateAsync(contentData);
        toast.success('Content created successfully');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const renderForm = () => {
    if (!content && contentId) {
      return null;
    }

    // Prepare initial data based on content type
    const baseInitialData = content ? {
      ...content,
      type: contentType,
      title: content.title || '',
      metadata: content.metadata || {},
      status: content.status || 'draft',
      content: contentType === 'page'
        ? { 
            body: (content.content as PageContent['content'])?.body || '',
            seo: (content.content as PageContent['content'])?.seo || {}
          }
        : {
            componentType: (content.content as ComponentContent['content'])?.componentType || '',
            props: (content.content as ComponentContent['content'])?.props || {},
            styles: (content.content as ComponentContent['content'])?.styles || {}
          }
    } : {
      type: contentType,
      title: '',
      metadata: {},
      status: 'draft',
      content: contentType === 'page'
        ? { body: '', seo: {} }
        : { componentType: '', props: {}, styles: {} }
    };

    switch (contentType) {
      case 'page':
        return <PageContentForm 
          initialData={baseInitialData as Partial<PageContent>}
          onSubmit={handleSubmit as (data: PageContent) => Promise<void>}
        />;
      case 'component':
        return <ComponentContentForm 
          initialData={baseInitialData as Partial<ComponentContent>}
          onSubmit={handleSubmit as (data: ComponentContent) => Promise<void>}
        />;
      default:
        return <div>Form for {contentType} type is not implemented yet</div>;
    }
  };

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10">
      <div className="space-y-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/70 mb-2">
            Content Type
          </label>
          <ContentTypeSelector value={contentType} onChange={setContentType} />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
          </div>
        ) : (
          renderForm()
        )}
      </div>
    </Card>
  );
};

export default ContentForm;