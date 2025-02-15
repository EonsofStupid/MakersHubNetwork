
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, ExternalLink, Key, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key_type: z.string().min(1, "Key type is required"),
  api_key: z.string().min(1, "API key is required"),
  description: z.string().optional(),
});

interface AddKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_PROVIDER_LINKS = {
  openai: "https://platform.openai.com/api-keys",
  stability: "https://platform.stability.ai/account/keys",
  replicate: "https://replicate.com/account/api-tokens",
};

export const AddKeyDialog = ({ open, onOpenChange }: AddKeyDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      key_type: "",
      api_key: "",
      description: "",
    },
  });

  const selectedKeyType = form.watch("key_type");

  // Clear form and state when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setShowConfirm(false);
    }
  }, [open, form]);

  // Clear clipboard after copying
  useEffect(() => {
    const clearClipboard = () => {
      if (document.hasFocus()) {
        navigator.clipboard.writeText("").catch(() => {});
      }
    };

    window.addEventListener('blur', clearClipboard);
    return () => window.removeEventListener('blur', clearClipboard);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Submitting API key...'); // Debug log
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const response = await supabase.functions.invoke('manage-api-key', {
        body: {
          action: 'create',
          name: values.name,
          key_type: values.key_type,
          api_key: values.api_key, // Include the actual API key
          description: values.description,
          metadata: {
            lastRotated: new Date().toISOString(),
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to store API key');
      }

      console.log('API key stored successfully'); // Debug log

      // Clear sensitive data immediately
      form.setValue('api_key', '');
      
      toast({
        title: "API key added successfully",
        description: "The API key has been securely stored",
      });

      // Close the form dialog
      form.reset();
      setShowConfirm(false);
      onOpenChange(false);

      // Refresh the API keys list
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });

    } catch (error: any) {
      console.error('Error storing API key:', error); // Debug log
      toast({
        title: "Error adding API key",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProviderLink = (keyType: string) => {
    return API_PROVIDER_LINKS[keyType as keyof typeof API_PROVIDER_LINKS] || null;
  };

  const handleDialogClose = () => {
    if (form.formState.isDirty) {
      if (window.confirm("Are you sure you want to close? Any unsaved API key data will be cleared.")) {
        form.reset();
        setShowConfirm(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Add New API Key
          </DialogTitle>
          <DialogDescription>
            API keys will be encrypted and stored securely. The full key will not be displayed again after creation.
          </DialogDescription>
          {selectedKeyType && getProviderLink(selectedKeyType) && (
            <a 
              href={getProviderLink(selectedKeyType)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Get your {selectedKeyType.toUpperCase()} API key <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            Treat API keys like passwords. They will be encrypted and stored securely. You won't be able to view the full key after saving.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., OpenAI Production Key" {...field} />
                  </FormControl>
                  <FormDescription>
                    A memorable name to identify this key
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a key type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="stability">Stability AI</SelectItem>
                      <SelectItem value="replicate">Replicate</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        className="pl-9"
                        placeholder="Enter your API key"
                        autoComplete="off"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This value will be encrypted and stored securely
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this key's usage or purpose"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : showConfirm ? "Confirm & Save" : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
