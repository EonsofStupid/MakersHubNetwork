import React from 'react';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

export function ContentPage() {
  const logger = useLogger('ContentPage', { category: LogCategory.CONTENT });
  
  // Log page access
  React.useEffect(() => {
    logger.info("Content management page accessed");
  }, [logger]);
  
  // For demo purposes, showing content management UI
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-2">Content Management</h1>
        <p className="text-muted-foreground mb-6">
          Create and manage content across your platform.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="text-primary h-5 w-5" />
            </div>
            <h3 className="font-semibold">Articles</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Create and manage blog articles and tutorials.
          </p>
          <div className="text-xs text-muted-foreground">
            12 articles published
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Image className="text-primary h-5 w-5" />
            </div>
            <h3 className="font-semibold">Media Library</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Upload and organize images, videos and other media.
          </p>
          <div className="text-xs text-muted-foreground">
            156 media items
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FolderOpen className="text-primary h-5 w-5" />
            </div>
            <h3 className="font-semibold">Collections</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Organize content into collections and categories.
          </p>
          <div className="text-xs text-muted-foreground">
            8 collections
          </div>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md text-sm"
            onClick={() => logger.info("Create article button clicked", {
              category: LogCategory.ADMIN
            })}
          >
            <FilePlus className="h-4 w-4" />
            Create new article
          </button>
          <button 
            className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-md text-sm"
            onClick={() => logger.info("Upload media button clicked", {
              category: LogCategory.ADMIN
            })}
          >
            <Image className="h-4 w-4" />
            Upload media
          </button>
          <button 
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-md text-sm"
            onClick={() => logger.warn("Viewing trash content", {
              category: LogCategory.ADMIN,
              details: { source: "ContentPage" }
            })}
          >
            <FileX className="h-4 w-4" />
            View trash
          </button>
        </div>
      </div>
    </div>
  );
}
