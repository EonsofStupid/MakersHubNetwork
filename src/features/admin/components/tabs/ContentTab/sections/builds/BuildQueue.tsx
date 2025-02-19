
import { Card } from "@/components/ui/card";
import { BuildSubmission } from "../../types/content.types";

interface BuildQueueProps {
  builds: BuildSubmission[];
  onReview: (build: BuildSubmission) => void;
}

export const BuildQueue = ({ builds, onReview }: BuildQueueProps) => {
  return (
    <div className="space-y-4">
      {builds.map((build) => (
        <Card
          key={build.id}
          className="p-4 cursor-pointer hover:border-primary/40 transition-all duration-300"
          onClick={() => onReview(build)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{build.title}</h3>
              <p className="text-sm text-muted-foreground">
                Submitted by {build.submittedBy} on {new Date(build.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">
              {build.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
