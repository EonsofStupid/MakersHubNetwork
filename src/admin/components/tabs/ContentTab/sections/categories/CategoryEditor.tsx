
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CategoryData } from "../../types/content.types";

interface CategoryEditorProps {
  category?: CategoryData;
  onSave: (data: Partial<CategoryData>) => void;
}

export const CategoryEditor = ({ category, onSave }: CategoryEditorProps) => {
  return (
    <Card className="p-4 space-y-4">
      <Input
        placeholder="Category Name"
        defaultValue={category?.name}
        className="w-full"
      />
      <Input
        placeholder="Slug"
        defaultValue={category?.slug}
        className="w-full"
      />
      <Button onClick={() => onSave({ name: "New Category", slug: "new-category" })} className="w-full">
        Save Category
      </Button>
    </Card>
  );
};
