import { useContentQuery } from "./useContentQuery";
import { useContentMutations } from "./useContentMutations";

export const useContent = (contentId?: string) => {
  const { data: content, isLoading } = useContentQuery(contentId);
  const { createContent, updateContent } = useContentMutations();

  return {
    content,
    isLoading,
    createContent,
    updateContent,
  };
};
