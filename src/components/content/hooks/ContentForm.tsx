import { isContentPage, isContentComponent } from "@/utils/validators";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

const handleSubmit = (content: Json) => {
  if (isContentPage(content)) {
    // Logic for page content
    console.log('Handling page content:', content);
  } else if (isContentComponent(content)) {
    // Logic for component content
    console.log('Handling component content:', content);
  } else {
    toast.error("Invalid content structure");
    return;
  }
};

export default handleSubmit;