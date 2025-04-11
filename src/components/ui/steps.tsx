
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export const Steps = ({ steps, currentStep }: StepsProps) => {
  return (
    <div className="relative space-y-4">
      <div className="relative flex pb-6">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          
          return (
            <div
              key={step.title}
              className={cn(
                "flex-1",
                index !== steps.length - 1 ? "pr-8" : ""
              )}
            >
              <div className="relative flex flex-col">
                <div
                  className={cn(
                    "flex items-center space-x-2",
                    isCompleted ? "text-primary" : isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                      isCompleted ? "border-primary bg-primary text-white" : isActive ? "border-primary" : "border-muted"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                <div className={cn(
                  "mt-2 text-xs",
                  isActive || isCompleted ? "text-muted-foreground" : "text-muted-foreground/60"
                )}>
                  {step.description}
                </div>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute right-0 top-4 h-0.5 w-full -translate-y-1/2 bg-muted",
                    {
                      "bg-primary": isCompleted,
                    }
                  )}
                  style={{ width: "calc(100% - 2rem)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface StepProps {
  title: string;
  description: string;
}

export const Step = ({ title, description }: StepProps) => {
  return null; // This is a type definition component, not rendered
};
