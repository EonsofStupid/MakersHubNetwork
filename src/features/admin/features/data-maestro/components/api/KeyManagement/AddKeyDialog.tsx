
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ApiKeyRequirements, ApiKeyType, ApiKeyCategory } from '../../../types/api-keys';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { providers } from '../../../constants/providers';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  key_type: z.enum(['openai', 'stability', 'replicate', 'custom', 'zapier', 'pinecone', 'anthropic', 'gemini', 'openrouter'], {
    required_error: "Please select a provider.",
  }),
  name: z.string().min(2, {
    message: "Key name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  provider_config: z.record(z.any()).optional(),
});

interface AddKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RawProviderRequirements {
  category: string;
  fields: Array<{
    name: string;
    type: 'password' | 'text' | 'url';
    required: boolean;
    validation: {
      pattern: string;
      message: string;
    };
  }>;
  description: string;
  docs_url?: string;
}

export function AddKeyDialog({ open, onOpenChange }: AddKeyDialogProps) {
  const [providerRequirements, setProviderRequirements] = useState<ApiKeyRequirements | null>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key_type: undefined,
      name: "",
      description: "",
      provider_config: {},
    },
  })

  useEffect(() => {
    if (form.watch("key_type")) {
      fetchProviderRequirements(form.watch("key_type"));
    }
  }, [form.watch("key_type")]);

  const fetchProviderRequirements = async (provider: ApiKeyType) => {
    try {
      const { data, error } = await supabase.rpc('get_api_key_requirements', {
        provider
      });
      
      if (error) throw error;
      
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Invalid provider requirements data');
      }

      // First cast to unknown to break the direct type chain
      const rawData = data as unknown;
      
      // Now safely cast to our intermediate type
      if (!isRawProviderRequirements(rawData)) {
        throw new Error('Invalid provider requirements structure');
      }
      
      // Convert to ApiKeyRequirements
      const requirements: ApiKeyRequirements = {
        category: validateApiKeyCategory(rawData.category),
        fields: rawData.fields.map(field => ({
          name: field.name,
          type: field.type,
          required: field.required,
          validation: {
            pattern: field.validation.pattern,
            message: field.validation.message
          }
        })),
        description: rawData.description,
        docs_url: rawData.docs_url
      };
      
      setProviderRequirements(requirements);
    } catch (error: any) {
      toast({
        title: "Error fetching provider requirements",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Type guard for RawProviderRequirements
  const isRawProviderRequirements = (data: unknown): data is RawProviderRequirements => {
    const d = data as RawProviderRequirements;
    return (
      typeof d === 'object' &&
      d !== null &&
      typeof d.category === 'string' &&
      Array.isArray(d.fields) &&
      typeof d.description === 'string'
    );
  };

  // Validate API Key Category
  const validateApiKeyCategory = (category: string): ApiKeyCategory => {
    if (category !== 'ai_service' && category !== 'integration') {
      throw new Error('Invalid API key category');
    }
    return category;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .insert({
          key_type: values.key_type,
          name: values.name,
          description: values.description,
          provider_config: values.provider_config,
          category: providerRequirements?.category || 'ai_service',
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "API Key Added",
        description: "Your API key has been successfully added.",
      });

      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New API Key</DialogTitle>
          <DialogDescription>
            Add a new API key to your account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="key_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the provider for this API key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give this key a unique, human-readable name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Useful for identifying the key later"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add a short description to help you identify this key.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {providerRequirements && providerRequirements.fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={`provider_config.${field.name}` as any}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>{field.name}</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        type={field.type}
                        required={field.required}
                        pattern={field.validation.pattern}
                        {...formField}
                      />
                    </FormControl>
                    {field.validation.message && (
                      <FormDescription>{field.validation.message}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit">Add Key</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
