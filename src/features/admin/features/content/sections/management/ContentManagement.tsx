
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentList } from './components/ContentList';
import { ContentFilters } from './components/ContentFilters';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContentFilter } from '../../types/content.types';

export const ContentManagement = () => {
  const [filter, setFilter] = useState<ContentFilter>({});

  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gradient text-2xl font-heading">
              Content Management
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create and manage your platform's content
            </CardDescription>
          </div>
          <Button className="mad-scientist-hover">
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ContentFilters filter={filter} onFilterChange={setFilter} />
        </motion.div>
        <ContentList filter={filter} />
      </CardContent>
    </Card>
  );
};
