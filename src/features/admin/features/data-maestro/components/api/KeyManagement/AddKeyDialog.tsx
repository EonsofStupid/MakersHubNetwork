
import { useEffect } from 'react';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Textarea } from '@/components/ui/textarea';
import { providers } from '../../../constants/providers';

const formSchema = z.object({
  key_type: z.string().min(2, {
    message: "Provider must be selected.",
  }),
  name: z.string().min(2, {
    message: "Key name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddKeyDialogProps {
  onKeyAdded: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddKeyDialog({ onKeyAdded, open, onOpenChange }: AddKeyDialogProps) {
  const { toast } = useToast();
  const [providerRequirements, setProviderRequirements] = useState<ApiKeyRequirements | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key_type: "",
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const provider = form.watch("key_type");
    if (provider) {
      fetchProviderRequirements(provider);
    }
  }, [form.watch("key_type")]);

  const fetchProviderRequirements = async (provider: string) => {
    try {
      const { data, error } = await supabase.rpc('get_api_key_requirements', {
        provider
      });
      
      if (error) throw error;

      const rawData = data as unknown;
      
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

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .insert({
          key_type: values.key_type,
          name: values.name,
          description: values.description,
          user_id: '00000000-0000-0000-0000-000000000000', // TODO: Replace with actual user ID
        });

      if (error) throw error;

      toast({
        title: "API Key Added",
        description: "Your API key has been successfully added.",
      });

      onKeyAdded();
      onOpenChange?.(false);
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
            {providerRequirements?.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.name}</Label>
                <Input 
                  id={field.name}
                  type={field.type}
                  required={field.required}
                  pattern={field.validation?.pattern}
                  title={field.validation?.message}
                />
              </div>
            ))}
            <Button type="submit">Add Key</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
