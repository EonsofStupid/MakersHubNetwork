
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Steps } from "@/components/ui/steps";
import { ApiKeyRequirements, ApiKeyCategory, ApiKeyType } from "../../../types/api-keys";
import { ProviderConfig } from "./ProviderConfig";

interface AddKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { title: "Select Provider", description: "Choose the API provider" },
  { title: "Configure", description: "Enter provider details" },
  { title: "Review", description: "Review and confirm" }
];

const CATEGORIES = [
  { id: 'ai_service', label: 'AI Services' },
  { id: 'integration', label: 'Integrations' }
];

export const AddKeyDialog = ({ open, onOpenChange }: AddKeyDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ApiKeyCategory | ''>('');
  const [selectedProvider, setSelectedProvider] = useState<ApiKeyType | ''>('');
  const [providerRequirements, setProviderRequirements] = useState<ApiKeyRequirements | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [providerConfig, setProviderConfig] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedCategory('');
    setSelectedProvider('');
    setProviderRequirements(null);
    setName('');
    setDescription('');
    setProviderConfig({});
  };

  const fetchProviderRequirements = async (provider: string) => {
    try {
      const { data, error } = await supabase.rpc('get_api_key_requirements', {
        provider
      });
      
      if (error) throw error;
      setProviderRequirements(data);
    } catch (error: any) {
      toast({
        title: "Error fetching provider requirements",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCategorySelect = (category: ApiKeyCategory) => {
    setSelectedCategory(category);
    setSelectedProvider('');
  };

  const handleProviderSelect = async (provider: ApiKeyType) => {
    setSelectedProvider(provider);
    await fetchProviderRequirements(provider);
  };

  const handleProviderConfig = (config: Record<string, string>) => {
    setProviderConfig(config);
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    if (!selectedProvider || !name || !providerConfig) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
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
          name,
          key_type: selectedProvider,
          category: selectedCategory,
          description,
          provider_config: providerConfig,
          metadata: {
            created_at: new Date().toISOString(),
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to store API key');
      }

      toast({
        title: "API key added successfully",
        description: `The ${selectedProvider.toUpperCase()} configuration has been securely stored`,
      });

      resetForm();
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Category</h3>
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleCategorySelect(category.id as ApiKeyCategory)}
                  >
                    <span className="text-lg font-semibold">{category.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Provider</h3>
                <Select
                  value={selectedProvider}
                  onValueChange={(value) => handleProviderSelect(value as ApiKeyType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory === 'ai_service' ? (
                      <>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="stability">Stability AI</SelectItem>
                        <SelectItem value="replicate">Replicate</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="zapier">Zapier</SelectItem>
                        <SelectItem value="pinecone">Pinecone</SelectItem>
                        <SelectItem value="custom">Custom Integration</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedProvider && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    placeholder="e.g., Production OpenAI Key"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="Add notes about key usage or purpose"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 1:
        return providerRequirements ? (
          <ProviderConfig
            requirements={providerRequirements}
            onSubmit={handleProviderConfig}
            isSubmitting={isSubmitting}
          />
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load provider requirements. Please try again.
            </AlertDescription>
          </Alert>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Review Configuration</AlertTitle>
              <AlertDescription className="space-y-2">
                <p><strong>Provider:</strong> {selectedProvider.toUpperCase()}</p>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Description:</strong> {description || 'N/A'}</p>
                <div className="mt-4">
                  <h4 className="font-semibold">Provider Configuration:</h4>
                  <pre className="mt-2 p-2 bg-muted rounded-md text-sm">
                    {JSON.stringify(providerConfig, null, 2)}
                  </pre>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Add New API Key
          </DialogTitle>
          <DialogDescription>
            Securely store and manage API keys for various services.
          </DialogDescription>
        </DialogHeader>

        <Steps currentStep={currentStep} steps={STEPS} />

        <div className="mt-4">
          {renderStepContent()}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep > 0) {
                setCurrentStep(prev => prev - 1);
              } else {
                onOpenChange(false);
              }
            }}
            disabled={isSubmitting}
          >
            {currentStep === 0 ? "Cancel" : "Back"}
          </Button>
          
          <Button
            onClick={() => {
              if (currentStep === 0 && selectedProvider && name) {
                setCurrentStep(1);
              } else if (currentStep === 2) {
                handleSubmit();
              }
            }}
            disabled={
              isSubmitting || 
              (currentStep === 0 && (!selectedProvider || !name)) ||
              (currentStep === 2 && !Object.keys(providerConfig).length)
            }
          >
            {isSubmitting 
              ? "Saving..." 
              : currentStep === 2 
                ? "Save API Key" 
                : "Continue"
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
