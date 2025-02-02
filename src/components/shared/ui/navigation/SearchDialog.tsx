import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search builds, parts, or guides..."
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#41f0db]"
          />
          <div className="text-sm text-white/60">
            Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to close
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};