
import { Card } from "@/components/ui/card";

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
}

interface MediaGridProps {
  assets: MediaAsset[];
  onSelect?: (asset: MediaAsset) => void;
}

export const MediaGrid = ({ assets, onSelect }: MediaGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {assets.map((asset) => (
        <Card
          key={asset.id}
          className="p-2 cursor-pointer hover:border-primary/40 transition-all duration-300"
          onClick={() => onSelect?.(asset)}
        >
          <img 
            src={asset.url} 
            alt={asset.filename}
            className="w-full h-32 object-cover rounded"
          />
          <p className="text-sm mt-2 truncate">{asset.filename}</p>
        </Card>
      ))}
    </div>
  );
};
