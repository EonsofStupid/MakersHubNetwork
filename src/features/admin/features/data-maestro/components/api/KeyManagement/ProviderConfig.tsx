
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ApiKeyRequirements } from '../../../types/api-keys';
import { ExternalLink } from 'lucide-react';

interface ProviderConfigProps {
  requirements: ApiKeyRequirements;
  onSubmit: (data: Record<string, string>) => void;
  isSubmitting: boolean;
}

export const ProviderConfig = ({ requirements, onSubmit, isSubmitting }: ProviderConfigProps) => {
  // Dynamically create schema based on requirements
  const schemaObj: Record<string, z.ZodType<any>> = {};
  requirements.fields.forEach(field => {
    const baseSchema = z.string().min(1, `${field.name} is required`);
    schemaObj[field.name] = field.required 
      ? baseSchema.regex(new RegExp(field.validation.pattern), field.validation.message)
      : baseSchema.optional();
  });
  
  const formSchema = z.object(schemaObj);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{requirements.category === 'ai_service' ? 'AI Service Configuration' : 'Integration Configuration'}</h3>
            {requirements.docs_url && (
              <a
                href={requirements.docs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-primary hover:underline"
              >
                Documentation <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{requirements.description}</p>
          
          {requirements.fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {field.name.replace(/_/g, ' ')}
                    {field.required && <span className="text-destructive">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={field.type}
                      placeholder={`Enter ${field.name.replace(/_/g, ' ')}`}
                      {...formField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
