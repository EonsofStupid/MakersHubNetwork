
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildSubmission } from "../../types/content.types";

interface BuildReviewerProps {
  build: BuildSubmission;
  onApprove: (build: BuildSubmission) => void;
  onReject: (build: BuildSubmission) => void;
}

export const BuildReviewer = ({ build, onApprove, onReject }: BuildReviewerProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{build.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{build.description}</p>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button
          onClick={() => onApprove(build)}
          className="mad-scientist-hover"
        >
          Approve
        </Button>
        <Button
          variant="destructive"
          onClick={() => onReject(build)}
        >
          Reject
        </Button>
      </CardFooter>
    </Card>
  );
};
