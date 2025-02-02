import React, { useState } from "react";
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploadZone } from "@/components/uploads";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import RichTextEditor from "@/components/content/blog/components/RichTextEditor";
import { Database } from "@/integrations/supabase/types";
import { PreviewDialog } from "@/components/content/blog/components/preview/PreviewDialog";
import { X } from "lucide-react";
import type { BaseContent } from "@/components/content/types/cms";

type PostCategory = Database["public"]["Enums"]["post_category"];

const PostEditor = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<{ body: string; seo?: { title?: string; description?: string; keywords?: string[] } }>({ body: "" });
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState<PostCategory | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  // Create a preview content object that matches BaseContent type
  const previewContent: BaseContent = {
    id: "",
    type: "page",
    title: title,
    content: content.body,
    status: "draft"
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create posts.");
        return;
      }

      if (!title || !content.body) {
        toast.error("Please fill in all required fields.");
        return;
      }

      if (!category) {
        toast.error("Please select a category.");
        return;
      }

      // Upload images
      const uploadedImageUrls = await Promise.all(
        images.map(async (file) => {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { error: uploadError } = await supabase.storage.from("media").upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from("media").getPublicUrl(filePath);
          return data.publicUrl;
        })
      );

      // Insert the blog post
      const { data: post, error: postError } = await supabase
        .from("blog_posts")
        .insert({
          title,
          slug: slug || title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
          content: content.body,
          rich_content: content,
          status: "draft",
          author_id: user.id,
          images: uploadedImageUrls,
          category,
          tags,
        })
        .select()
        .single();

      if (postError) throw postError;

      toast.success("Post saved successfully.");
      resetForm();
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent({ body: "" });
    setImages([]);
    setCategory(null);
    setTags([]);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 p-8">
      <AdminNav />
      <div className="container mx-auto">
        <Card className="glass border-white/10 p-6 bg-black/40 backdrop-blur-xl shadow-[0_0_15px_rgba(65,240,219,0.2)] animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create New Post</h1>
            <PreviewDialog content={previewContent} />
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-white/80 block mb-2">Title</label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-[#41f0db] focus:ring-[#41f0db]/20 transition-all duration-300"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="text-white/80 block mb-2">Slug (optional)</label>
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-white/5 border-white/10 text-white focus:border-[#41f0db] focus:ring-[#41f0db]/20 transition-all duration-300"
                placeholder="Enter URL slug"
              />
            </div>

            <div>
              <label className="text-white/80 block mb-2">Content</label>
              <RichTextEditor
                content={content.body}
                onChange={(body) => setContent((prev) => ({ ...prev, body }))}
                onCategoryChange={(cat) => setCategory(cat as PostCategory)}
                onTagsChange={setTags}
              />
            </div>

            <ImageUploadZone images={images} onImagesChange={setImages} />

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={resetForm}
                className="border-white/10 text-white hover:bg-white/5 hover:border-[#41f0db] transition-all duration-300 group"
              >
                <X className="w-4 h-4 mr-2 group-hover:text-[#41f0db]" />
                Clear
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#41f0db]/20 backdrop-blur-sm text-white border border-[#41f0db]/50 hover:bg-[#41f0db]/30 hover:border-[#41f0db] transition-all duration-300 shadow-[0_0_15px_rgba(65,240,219,0.3)]"
              >
                Save Post
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostEditor;