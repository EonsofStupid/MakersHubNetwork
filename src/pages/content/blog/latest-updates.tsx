import { motion } from "framer-motion";
import { useState } from "react";
import { Navigation } from "@/components/shared/ui/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ContentGrid } from "@/components/content/discovery/ContentGrid";
import { BlogPostCard } from "@/components/content/blog";

const fetchBlogPosts = async () => {
  console.log("Starting fetchBlogPosts function...");
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    console.log("Fetched blog posts successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in fetchBlogPosts:", error);
    throw error;
  }
};

const GlitchEffect = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="absolute inset-0 animate-glitch opacity-50" 
      style={{
        backgroundImage: "url('/lovable-uploads/4edf410a-5bd3-426b-8efe-fb8acb60e39c.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        mixBlendMode: "overlay"
      }}
    />
  </div>
);

const LatestUpdates = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#1a1a1a] relative overflow-hidden"
    >
      <Navigation />
      <GlitchEffect />
      
      <div className="relative z-10 container mx-auto px-6 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-[#41f0db] text-5xl md:text-7xl font-bold mb-8 animate-neon-pulse">
            Latest Updates
          </h1>
        </motion.div>

        <ContentGrid
          type="blog"
          items={posts}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </motion.div>
  );
};

export default LatestUpdates;