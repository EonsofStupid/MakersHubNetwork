import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Layout,
  Type,
  Image,
  Box,
  Columns,
  Layers,
  PlayCircle,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const VisualEditorControls = () => {
  const tools = [
    { id: "container", icon: Box, label: "Add Container" },
    { id: "section", icon: Layout, label: "Add Section" },
    { id: "columns", icon: Columns, label: "Add Columns" },
    { id: "text", icon: Type, label: "Add Text" },
    { id: "image", icon: Image, label: "Add Image" },
    { id: "animation", icon: PlayCircle, label: "Add Animation" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-2"
    >
      <TooltipProvider>
        <div className="flex items-center space-x-2">
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <tool.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tool.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden md:inline">Add Page</span>
      </Button>
    </motion.div>
  );
};

export default VisualEditorControls;