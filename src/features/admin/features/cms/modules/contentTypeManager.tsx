
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";
import { PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cmsKeys } from '../queries/keys';

// Types
export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  is_system: boolean;
}

// Validation Schema
const contentTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type ContentTypeFormValues = z.infer<typeof contentTypeSchema>;

// Hook for managing content types
export const useContentTypes = () => {
  const queryClient = useQueryClient();
  
  // Fetch content types
  const { data: contentTypes = [], isLoading } = useQuery({
    queryKey: cmsKeys.types.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_types')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ContentType[];
    }
  });

  // Create new content type
  const { mutate: createContentType } = useMutation({
    mutationFn: async (values: ContentTypeFormValues) => {
      const { data, error } = await supabase
        .from('content_types')
        .insert({
          name: values.name,
          slug: values.name.toLowerCase().replace(/\s+/g, '-'),
          description: values.description,
          is_system: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cmsKeys.types.list() });
      toast({
        title: "Success",
        description: "Content type created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating content type:', error);
      toast({
        title: "Error",
        description: "Failed to create content type",
        variant: "destructive",
      });
    }
  });

  return {
    contentTypes,
    isLoading,
    createContentType,
  };
};

// Content Type Creation Modal Component
export const CreateContentTypeModal = () => {
  const [open, setOpen] = useState(false);
  const { createContentType } = useContentTypes();
  
  const form = useForm<ContentTypeFormValues>({
    resolver: zodResolver(contentTypeSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (values: ContentTypeFormValues) => {
    createContentType(values);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Content Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Blog Post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe this content type..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Select Component for Content Types
export const ContentTypeSelect = ({ 
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange: (value: string) => void;
}) => {
  const { contentTypes, isLoading } = useContentTypes();

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
      >
        <option value="">Select Type</option>
        {contentTypes.map((type) => (
          <option key={type.id} value={type.slug}>
            {type.name}
          </option>
        ))}
      </select>
      <CreateContentTypeModal />
    </div>
  );
};
