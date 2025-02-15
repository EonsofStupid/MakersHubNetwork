
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
import { AlertTriangle, ExternalLink, Key, Shield, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Steps, Step } from "@/components/ui/steps";

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

const PROVIDER_DESCRIPTIONS = {
  openai: {
    title: "OpenAI API Key",
    description: "Used for AI features like content generation and analysis",
    keyFormat: "Starts with 'sk-' followed by 32+ characters",
    rateLimit: "Depends on your OpenAI plan",
    warning: "Keep this key secure. It provides access to paid AI services.",
  },
  stability: {
    title: "Stability AI Key",
    description: "Used for image generation and AI art features",
    keyFormat: "32+ character string",
    rateLimit: "Based on your Stability AI subscription",
    warning: "Secure key with access to paid image generation services.",
  },
  replicate: {
    title: "Replicate API Token",
    description: "Used for running various AI models",
    keyFormat: "32+ character string",
    rateLimit: "Based on your Replicate credits",
    warning: "Protect this token as it can incur usage charges.",
  },
  custom: {
    title: "Custom Integration Key",
    description: "Used for custom third-party service integration",
    keyFormat: "Format depends on the service",
    rateLimit: "Varies by service",
    warning: "Ensure proper security measures for third-party credentials.",
  },
};

export const AddKeyDialog = ({ open, onOpenChange }: AddKeyDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyRequirements, setKeyRequirements] = useState<any>(null);
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
  const apiKey = form.watch("api_key");

  useEffect(() => {
    if (!open) {
      form.reset();
      setCurrentStep(0);
      setKeyRequirements(null);
    }
  }, [open, form]);

  useEffect(() => {
    const clearClipboard = () => {
      if (document.hasFocus()) {
        navigator.clipboard.writeText("").catch(() => {});
      }
    };

    window.addEventListener('blur', clearClipboard);
    return () => window.removeEventListener('blur', clearClipboard);
  }, []);

  useEffect(() => {
    if (selectedKeyType) {
      const fetchRequirements = async () => {
        const { data, error } = await supabase.rpc('get_api_key_requirements', {
          provider: selectedKeyType
        });
        if (!error && data) {
          setKeyRequirements(data);
        }
      };
      fetchRequirements();
    }
  }, [selectedKeyType]);

  const validateKeyFormat = () => {
    if (!keyRequirements || !apiKey) return false;
    const regex = new RegExp(keyRequirements.format_regex || '.*');
    return regex.test(apiKey) && apiKey.length >= keyRequirements.min_length;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (currentStep < 2) {
      if (currentStep === 0 && !selectedKeyType) {
        toast({
          title: "Please select a key type",
          description: "Choose the type of API key you want to add",
          variant: "destructive",
        });
        return;
      }
      if (currentStep === 1 && !validateKeyFormat()) {
        toast({
          title: "Invalid API key format",
          description: keyRequirements?.description || "Please check the key format requirements",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(prev => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const response = await supabase.functions.invoke('manage-api-key', {
        body: {
          action: 'create',
          name: values.name,
          key_type: values.key_type,
          api_key: values.api_key,
          description: values.description,
          metadata: {
            lastRotated: new Date().toISOString(),
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to store API key');
      }

      form.setValue('api_key', '');
      
      toast({
        title: "API key added successfully",
        description: `The ${PROVIDER_DESCRIPTIONS[values.key_type as keyof typeof PROVIDER_DESCRIPTIONS].title} has been securely stored`,
      });

      form.reset();
      setCurrentStep(0);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });

    } catch (error: any) {
      console.error('Error storing API key:', error);
      toast({
        title: "Error adding API key",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    if (form.formState.isDirty) {
      if (window.confirm("Are you sure you want to close? Any unsaved API key data will be cleared.")) {
        form.reset();
        setCurrentStep(0);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const steps = [
    { title: "Select Provider", description: "Choose the API key provider" },
    { title: "Enter Key", description: "Input the API key securely" },
    { title: "Confirm", description: "Review and save" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Add New API Key
          </DialogTitle>
          <DialogDescription>
            Securely store and manage API keys for various services.
          </DialogDescription>
        </DialogHeader>

        <Steps currentStep={currentStep} steps={steps} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === 0 && (
              <FormField
                control={form.control}
                name="key_type"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="stability">Stability AI</SelectItem>
                        <SelectItem value="replicate">Replicate</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedKeyType && (
                      <Alert>
                        <AlertTitle>{PROVIDER_DESCRIPTIONS[selectedKeyType as keyof typeof PROVIDER_DESCRIPTIONS].title}</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>{PROVIDER_DESCRIPTIONS[selectedKeyType as keyof typeof PROVIDER_DESCRIPTIONS].description}</p>
                          <p className="text-sm text-muted-foreground">
                            Format: {PROVIDER_DESCRIPTIONS[selectedKeyType as keyof typeof PROVIDER_DESCRIPTIONS].keyFormat}
                          </p>
                          {API_PROVIDER_LINKS[selectedKeyType as keyof typeof API_PROVIDER_LINKS] && (
                            <a
                              href={API_PROVIDER_LINKS[selectedKeyType as keyof typeof API_PROVIDER_LINKS]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-primary hover:underline"
                            >
                              Get your API key <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {currentStep === 1 && (
              <>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Notice</AlertTitle>
                  <AlertDescription>
                    {PROVIDER_DESCRIPTIONS[selectedKeyType as keyof typeof PROVIDER_DESCRIPTIONS].warning}
                  </AlertDescription>
                </Alert>

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
                            placeholder={`Enter ${selectedKeyType} API key`}
                            autoComplete="off"
                            {...field}
                          />
                          {apiKey && (
                            <div className="absolute right-3 top-2.5">
                              {validateKeyFormat() ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        {keyRequirements?.description}
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Production OpenAI Key" {...field} />
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add notes about key usage or purpose"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {currentStep === 2 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Confirm API Key Details</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p><strong>Provider:</strong> {PROVIDER_DESCRIPTIONS[selectedKeyType as keyof typeof PROVIDER_DESCRIPTIONS].title}</p>
                  <p><strong>Name:</strong> {form.getValues("name")}</p>
                  <p><strong>Description:</strong> {form.getValues("description") || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">
                    The key will be encrypted and stored securely. You won't be able to view it again.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(prev => prev - 1);
                  } else {
                    handleDialogClose();
                  }
                }}
                disabled={isSubmitting}
              >
                {currentStep === 0 ? "Cancel" : "Back"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Saving..." 
                  : currentStep === 2 
                    ? "Save API Key" 
                    : "Continue"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
