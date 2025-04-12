
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/ui/dialog";
import { ScrollArea } from "@/shared/ui/scroll-area";

interface TextWithPopupProps {
  text: string;
  label: string;
}

export function TextWithPopup({ text, label }: TextWithPopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative cursor-pointer">
          <p className="truncate text-sm text-muted-foreground">
            {label}: {text}
          </p>
          <Maximize2 className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-primary/20">
        <ScrollArea className="h-[300px] w-full p-4">
          <h4 className="font-medium mb-2">{label}</h4>
          <pre className="whitespace-pre-wrap break-words text-sm">{text}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 
