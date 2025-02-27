
import { Card } from "@/components/ui/card";

interface BuilderProfile {
  id: string;
  name: string;
  builds: number;
  joinedAt: string;
}

interface BuilderProfilesProps {
  builders: BuilderProfile[];
  onSelect: (builder: BuilderProfile) => void;
}

export const BuilderProfiles = ({ builders, onSelect }: BuilderProfilesProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {builders.map((builder) => (
        <Card
          key={builder.id}
          className="p-4 cursor-pointer hover:border-primary/40 transition-all duration-300"
          onClick={() => onSelect(builder)}
        >
          <h3 className="font-medium">{builder.name}</h3>
          <p className="text-sm text-muted-foreground">
            {builder.builds} builds · Joined {new Date(builder.joinedAt).toLocaleDateString()}
          </p>
        </Card>
      ))}
    </div>
  );
};
