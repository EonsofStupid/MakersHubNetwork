import { toast } from "sonner";
import type { ContentType } from "../types/contentTypes";
import { getSchemaByType } from "../types/contentTypes";

export const validateContent = async (type: ContentType, data: unknown) => {
  try {
    const schema = getSchemaByType(type);
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    console.error("Content validation error:", error);
    toast.error("Content validation failed");
    return { success: false, error };
  }
};

export const validateContentRelationship = (parentType: ContentType, childType: ContentType) => {
  // Define allowed relationships between content types
  const allowedRelationships: Record<ContentType, ContentType[]> = {
    page: ["component", "template"],
    component: ["component"],
    template: ["component", "page"],
    workflow: ["page", "component", "template"],
  };

  const isAllowed = allowedRelationships[parentType]?.includes(childType);
  if (!isAllowed) {
    toast.error(`Relationship between ${parentType} and ${childType} is not allowed`);
  }
  
  return isAllowed;
};