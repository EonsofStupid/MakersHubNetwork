import React from 'react';
import { Button } from '@/shared/ui/button';

export function ButtonDemo() {
  return (
    <div className="grid grid-flow-col gap-2">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
