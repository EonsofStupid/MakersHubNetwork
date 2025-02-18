import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ApiKeyRequirements } from '../../../types/api-keys';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  provider: z.string().min(2, {
    message: "Provider must be at least 2 characters.",
  }),
  keyName: z.string().min(2, {
    message: "Key name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

interface AddKeyDialogProps {
  onKeyAdded: () => void;
}

export function AddKeyDialog({ onKeyAdded }: AddKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [providerRequirements, setProviderRequirements] = useState<ApiKeyRequirements | null>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "",
      keyName: "",
      description: "",
    },
  })

  useEffect(() => {
    if (form.watch("provider")) {
      fetchProviderRequirements(form.watch("provider"));
    }
  }, [form.watch("provider")]);

  const fetchProviderRequirements = async (provider: string) => {
    try {
      const { data, error } = await supabase.rpc('get_api_key_requirements', {
        provider
      });
      
      if (error) throw error;

      // Cast to unknown first, then validate the shape
      const rawData = data as unknown;
      
      // Type guard to validate the response shape
      const isValidApiKeyRequirements = (data: unknown): data is ApiKeyRequirements => {
        if (!data || typeof data !== 'object') return false;
        const req = data as Partial<ApiKeyRequirements>;
        return (
          typeof req.category === 'string' &&
          Array.isArray(req.fields) &&
          typeof req.description === 'string'
        );
      };

      if (!isValidApiKeyRequirements(rawData)) {
        throw new Error('Invalid API key requirements format');
      }

      setProviderRequirements(rawData);
    } catch (error: any) {
      toast({
        title: "Error fetching provider requirements",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .insert({
          provider: values.provider,
          key_name: values.keyName,
          description: values.description,
          user_id: '00000000-0000-0000-0000-000000000000', // TODO: Replace with actual user ID
        });

      if (error) throw error;

      toast({
        title: "API Key Added",
        description: "Your API key has been successfully added.",
      });

      onKeyAdded();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add API Key</Button>
      </DialogTrigger>
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
              control={{
                ...form.control,
                name: "provider"
              }}
              name="provider"
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
              name="keyName"
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
              <div key={field}>
                <Label htmlFor={field}>{field}</Label>
                <Input id={field} />
              </div>
            ))}
            <Button type="submit">Add Key</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
