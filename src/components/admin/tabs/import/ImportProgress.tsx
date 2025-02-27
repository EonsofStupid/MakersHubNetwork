
import { Progress } from '@/components/ui/progress';

type Props = {
  current: number;
  total: number;
  status: string;
};

export const ImportProgress = ({ current, total, status }: Props) => {
  const progress = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{status}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
      <p className="text-sm text-muted-foreground">
        Processed {current} of {total} rows
      </p>
    </div>
  );
};
