import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import VisualEditorControls from "./VisualEditorControls";
import VisualEditorPresets from "./VisualEditorPresets";
import ElementEditor from "./ElementEditor";
import PreviewMode from "./PreviewMode";
import { BuilderElement } from "@/types/builder";

interface VisualEditorProps {
  initialContent?: BuilderElement[];
  onSave: (elements: BuilderElement[]) => void;
}

const VisualEditor = ({ initialContent = [], onSave }: VisualEditorProps) => {
  const [elements, setElements] = useState<BuilderElement[]>(initialContent);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("edit");
  const { toast } = useToast();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setElements(items);
  };

  const handleAddElement = (preset: any) => {
    const newElement: BuilderElement = {
      id: `element-${Date.now()}`,
      type: preset.name.toLowerCase(),
      content: preset.default_props || {},
    };
    setElements([...elements, newElement]);
    toast({
      title: "Element Added",
      description: `Added new ${preset.name} element`,
    });
  };

  const handleUpdateElement = (elementId: string, content: any) => {
    setElements(
      elements.map((el) =>
        el.id === elementId ? { ...el, content } : el
      )
    );
  };

  const handleDeleteElement = (elementId: string) => {
    setElements(elements.filter((el) => el.id !== elementId));
    setSelectedElement(null);
    toast({
      title: "Element Deleted",
      description: "The element has been removed",
    });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <VisualEditorControls />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="flex-1">
          <Card className="p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="editor">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[500px]"
                  >
                    {elements.map((element, index) => (
                      <motion.div
                        key={element.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <ElementEditor
                          element={element}
                          index={index}
                          isSelected={selectedElement === element.id}
                          onSelect={() => setSelectedElement(element.id)}
                          onUpdate={handleUpdateElement}
                          onDelete={handleDeleteElement}
                        />
                      </motion.div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <PreviewMode elements={elements} />
        </TabsContent>

        <TabsContent value="presets">
          <VisualEditorPresets onSelectPreset={handleAddElement} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualEditor;