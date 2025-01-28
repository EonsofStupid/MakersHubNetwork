import React from "react";
import { Button } from "@/components/ui/button";
import { AdaptivePopup } from "./AdaptivePopup";
import { useAdaptivePopup } from "@/hooks/useAdaptivePopup";

export function AdaptivePopupExample() {
  const { isOpen, open, close } = useAdaptivePopup();

  return (
    <AdaptivePopup
      open={isOpen}
      onOpenChange={close}
      title="Example Popup"
      trigger={
        <Button onClick={open} variant="outline">
          Open Popup
        </Button>
      }
    >
      <div className="space-y-4">
        <p>This is an example of the adaptive popup content.</p>
        <p>The popup will automatically handle:</p>
        <ul className="list-disc list-inside">
          <li>Content overflow</li>
          <li>Responsive sizing</li>
          <li>Animations</li>
          <li>Keyboard navigation</li>
          <li>Focus management</li>
        </ul>
      </div>
    </AdaptivePopup>
  );
}