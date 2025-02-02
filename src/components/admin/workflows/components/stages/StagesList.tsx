import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StageCard } from './StageCard';
import type { WorkflowStage } from '../../types';

interface StagesListProps {
  stages: WorkflowStage[];
  onStagesChange: (stages: WorkflowStage[]) => void;
}

export const StagesList = ({ stages, onStagesChange }: StagesListProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(stages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedStages = items.map((stage, index) => ({
      ...stage,
      order: index
    }));

    onStagesChange(updatedStages);
  };

  const updateStage = (stageId: string, updates: Partial<WorkflowStage>) => {
    onStagesChange(stages.map(stage => 
      stage.id === stageId ? { ...stage, ...updates } : stage
    ));
  };

  const removeStage = (stageId: string) => {
    onStagesChange(stages.filter(stage => stage.id !== stageId));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="stages">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            <AnimatePresence>
              {stages.map((stage, index) => (
                <Draggable key={stage.id} draggableId={stage.id} index={index}>
                  {(provided) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="relative"
                    >
                      <StageCard
                        stage={stage}
                        index={index}
                        onUpdate={updateStage}
                        onDelete={removeStage}
                        dragHandleProps={provided.dragHandleProps}
                      />
                      
                      {index < stages.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowRight className="w-6 h-6 text-neon-cyan/50" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};