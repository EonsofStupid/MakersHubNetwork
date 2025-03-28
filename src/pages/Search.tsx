
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("builds");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchTerm, searchCategory],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      let query;
      if (searchCategory === "builds") {
        query = supabase
          .from("printer_builds")
          .select("id, title, description, status")
          .eq("status", "approved")
          .ilike("title", `%${searchTerm}%`)
          .limit(10);
      } else if (searchCategory === "parts") {
        query = supabase
          .from("printer_parts")
          .select("id, name, description, slug")
          .eq("status", "published")
          .ilike("name", `%${searchTerm}%`)
          .limit(10);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: searchTerm.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is triggered by the useQuery hook when searchTerm changes
  };

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">Search</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for builds, parts, or guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <Tabs defaultValue="builds" className="mt-4" onValueChange={setSearchCategory}>
            <TabsList>
              <TabsTrigger value="builds">Builds</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      
      {searchTerm.length < 2 ? (
        <div className="text-center text-muted-foreground">
          <p>Start typing to search (minimum 2 characters)</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : searchResults?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">No results found for "{searchTerm}"</p>
          <p className="text-muted-foreground">Try a different search term or category</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Results for "{searchTerm}" in {searchCategory}
          </h2>
          
          <div className="divide-y">
            {searchResults?.map((result: any) => (
              <div key={result.id} className="py-4">
                <Link 
                  to={`/${searchCategory === "builds" ? "builds" : "parts"}/${result.id}`} 
                  className="block hover:bg-muted p-4 rounded-md transition-colors"
                >
                  <h3 className="text-lg font-medium">{result.title || result.name}</h3>
                  {result.description && (
                    <p className="text-muted-foreground line-clamp-2 mt-1">{result.description}</p>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
