
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Steps } from "@/components/ui/steps";
import { APIKeyType } from "@/types/database";
import { ApiKeyFormData } from './types';

interface AddKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddKeyDialog = ({ isOpen, onClose, onSuccess }: AddKeyDialogProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: '',
    key_type: 'openai',
    api_key: '',
    description: ''
  });

  const steps = [
    {
      title: "Provider Selection",
      description: "Choose the API provider and name"
    },
    {
      title: "API Key Input",
      description: "Enter your API key securely"
    },
    {
      title: "Verification",
      description: "Verify and save your key"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/manage-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`
        },
        body: JSON.stringify({
          action: 'create',
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add API key');
      }

      toast({
        title: "Success",
        description: "API key added successfully",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding API key:', error);
      toast({
        title: "Error",
        description: "Failed to add API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New API Key</DialogTitle>
          <DialogDescription>
            Securely store and manage your API keys
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Steps steps={steps} currentStep={currentStep} />
        </div>

        <div className="py-4 space-y-4">
          {currentStep === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="key_type">Provider</Label>
                <select
                  id="key_type"
                  name="key_type"
                  value={formData.key_type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="openai">OpenAI</option>
                  <option value="stability">Stability AI</option>
                  <option value="replicate">Replicate</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Production OpenAI Key"
                />
              </div>
            </>
          )}

          {currentStep === 1 && (
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                name="api_key"
                type="password"
                value={formData.api_key}
                onChange={handleChange}
                placeholder="Enter your API key"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a description for this key"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add Key"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
