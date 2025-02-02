import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AdvancedCSSEditorProps {
  currentCSS: string;
  onSave: (css: string) => void;
  onReset: () => void;
}

export const AdvancedCSSEditor: React.FC<AdvancedCSSEditorProps> = ({
  currentCSS,
  onSave,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [understood, setUnderstood] = useState(false);
  const [cssContent, setCssContent] = useState(currentCSS);

  const handleSave = () => {
    try {
      onSave(cssContent);
      toast.success("CSS updated successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update CSS");
    }
  };

  const handleReset = () => {
    onReset();
    setCssContent(currentCSS);
    toast.success("CSS reset to default");
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="w-full mt-4 bg-gray-800/50 border-purple-500/30 hover:border-purple-500/50 text-purple-300"
      >
        Advanced CSS
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {showWarning ? (
          <DialogContent className="bg-gray-900/95 border border-red-500/20">
            <DialogHeader>
              <DialogTitle className="text-red-400">⚠️ Warning: Advanced CSS Editor</DialogTitle>
              <DialogDescription className="text-gray-400">
                Direct edits to CSS can cause serious issues with the website's appearance and functionality.
                Only proceed if you understand the implications.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="understood" 
                checked={understood}
                onCheckedChange={(checked) => setUnderstood(checked as boolean)}
              />
              <Label htmlFor="understood" className="text-sm text-gray-300">
                I understand the risks of editing CSS directly
              </Label>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!understood}
                onClick={() => setShowWarning(false)}
              >
                Proceed
              </Button>
            </div>
          </DialogContent>
        ) : (
          <DialogContent className="bg-gray-900/95 border border-purple-500/20 max-w-4xl">
            <DialogHeader>
              <DialogTitle>Advanced CSS Editor</DialogTitle>
              <DialogDescription>
                Edit the CSS directly. Changes will be applied in real-time.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[600px] w-full rounded-md border border-gray-700 bg-gray-800/50">
              <textarea
                value={cssContent}
                onChange={(e) => setCssContent(e.target.value)}
                className="w-full h-full p-4 bg-transparent text-sm font-mono text-gray-300 focus:outline-none"
                spellCheck="false"
              />
            </ScrollArea>
            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleReset}
              >
                Reset to Default
              </Button>
              <div className="space-x-2">
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};