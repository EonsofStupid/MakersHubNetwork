
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkflowEditor } from '../../stores/workflow-editor';
import { WorkflowFieldType } from '../../types/workflow-enums';
import { WorkflowField } from '../../types/workflow';
import { cn } from '@/lib/utils';

export function WorkflowEditor() {
  const { 
    currentWorkflow,
    isDirty,
    errors,
    setWorkflow,
    addField,
    updateField,
    removeField,
    moveField,
    validateWorkflow
  } = useWorkflowEditor();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    moveField(result.source.index, result.destination.index);
  };

  const handleSave = async () => {
    if (!validateWorkflow()) return;
    // TODO: Implement save logic
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Workflow Editor</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => useWorkflowEditor.getState().resetWorkflow()}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Workflow Name"
              value={currentWorkflow?.name || ''}
              onChange={(e) => setWorkflow({ ...currentWorkflow, name: e.target.value })}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Description (optional)"
              value={currentWorkflow?.description || ''}
              onChange={(e) => setWorkflow({ ...currentWorkflow, description: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Fields</h3>
            <Select
              onValueChange={(value) => addField(value as WorkflowFieldType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Add Field" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(WorkflowFieldType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {currentWorkflow?.fields?.map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Input
                                placeholder="Field Name"
                                value={field.name}
                                onChange={(e) => updateField(field.id, { name: e.target.value })}
                                className="max-w-xs"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeField(field.id)}
                              >
                                Remove
                              </Button>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={field.required}
                                  onCheckedChange={(checked) => 
                                    updateField(field.id, { required: checked })
                                  }
                                />
                                <span>Required</span>
                              </div>
                              <span className="text-muted-foreground">
                                Type: {field.type}
                              </span>
                            </div>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Card>
    </div>
  );
}
