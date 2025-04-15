
import { LoadingSkeleton } from '@/shared/types/layout.types';
import { cn } from '@/shared/utils';
import { Skeleton } from './skeleton';

interface LoadingStatesProps extends Partial<LoadingSkeleton> {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingStates({
  type = 'text',
  count = 1,
  height,
  width,
  className,
  children,
}: LoadingStatesProps) {
  if (children) return <>{children}</>;

  const items = Array.from({ length: count }, (_, i) => i);

  const getSkeletonStyles = () => {
    switch (type) {
      case 'card':
        return 'h-[180px] w-full rounded-lg';
      case 'avatar':
        return 'h-10 w-10 rounded-full';
      case 'button':
        return 'h-9 w-[100px] rounded-md';
      case 'list':
        return 'h-12 w-full rounded-md';
      default:
        return 'h-4 w-[250px] rounded-md';
    }
  };

  const styles = cn(
    getSkeletonStyles(),
    className,
    height && `h-[${height}px]`,
    width && `w-[${width}px]`
  );

  return (
    <>
      {items.map((i) => (
        <Skeleton key={i} className={styles} />
      ))}
    </>
  );
}

export function ContentLoader({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      <LoadingStates type="text" width={70} />
      {Array.from({ length: lines - 1 }, (_, i) => (
        <LoadingStates key={i} type="text" width={Math.floor(Math.random() * 30) + 60} />
      ))}
    </div>
  );
}

export function CardLoader({ className, count = 1 }: { className?: string; count?: number }) {
  return (
    <div className={cn("grid gap-4", className, count > 1 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
      {Array.from({ length: count }, (_, i) => (
        <LoadingStates key={i} type="card" />
      ))}
    </div>
  );
}

