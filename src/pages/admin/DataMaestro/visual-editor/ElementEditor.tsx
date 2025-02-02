import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, X, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BuilderElement } from "@/types/builder";

interface ElementEditorProps {
  element: BuilderElement;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, content: any) => void;
  onDelete: (id: string) => void;
}

const ElementEditor = ({
  element,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: ElementEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleContentUpdate = (key: string, value: string) => {
    onUpdate(element.id, { ...element.content, [key]: value });
  };

  return (
    <Draggable draggableId={element.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-4"
        >
          <Card
            className={`p-4 ${
              isSelected ? "ring-2 ring-primary" : ""
            } relative group`}
            onClick={onSelect}
          >
            <div className="flex items-center justify-between">
              <div
                {...provided.dragHandleProps}
                className="flex items-center gap-2"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium capitalize">{element.type}</span>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sheet open={isEditing} onOpenChange={setIsEditing}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit {element.type}</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      {Object.entries(element.content).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium mb-1 block">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                          {typeof value === "string" && value.length > 50 ? (
                            <Textarea
                              value={value}
                              onChange={(e) =>
                                handleContentUpdate(key, e.target.value)
                              }
                            />
                          ) : (
                            <Input
                              value={value || ''}
                              onChange={(e) =>
                                handleContentUpdate(key, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(element.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              {element.type === "text" && (
                <p className="text-sm text-muted-foreground">
                  {element.content.text || ''}
                </p>
              )}
              {element.type === "image" && element.content.url && (
                <img
                  src={element.content.url}
                  alt={element.content.alt || ''}
                  className="max-w-full h-auto rounded"
                />
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default ElementEditor;