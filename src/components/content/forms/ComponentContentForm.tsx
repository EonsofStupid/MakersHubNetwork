import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { componentContentSchema } from '../types/contentTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { ComponentContent } from '../types/contentTypes';

interface ComponentContentFormProps {
  initialData?: Partial<ComponentContent>;
  onSubmit: (data: ComponentContent) => void;
}

const ComponentContentForm: React.FC<ComponentContentFormProps> = ({ initialData, onSubmit }) => {
  const form = useForm<ComponentContent>({
    resolver: zodResolver(componentContentSchema),
    defaultValues: {
      type: 'component',
      title: initialData?.title || '',
      content: {
        componentType: initialData?.content?.componentType || '',
        props: initialData?.content?.props || {},
        styles: initialData?.content?.styles || {},
      },
      status: initialData?.status || 'draft',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Component Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/5 border-white/10" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content.componentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Component Type</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white/5 border-white/10" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content.props"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Props (JSON)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  value={JSON.stringify(field.value, null, 2)}
                  onChange={e => {
                    try {
                      const value = JSON.parse(e.target.value);
                      field.onChange(value);
                    } catch (error) {
                      // Allow invalid JSON while typing
                      field.onChange(e.target.value);
                    }
                  }}
                  className="bg-white/5 border-white/10 font-mono"
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="bg-neon-cyan/20 text-white border border-neon-cyan/50 hover:bg-neon-cyan/30"
        >
          Save Component
        </Button>
      </form>
    </Form>
  );
};

export default ComponentContentForm;