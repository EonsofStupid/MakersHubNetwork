
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function Themes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="text-primary w-5 h-5" />
        <h1 className="text-2xl font-bold">Theme Manager</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Browse and customize platform themes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4 bg-muted/50 border-primary/30">
              <h3 className="font-medium mb-1">Cyberpunk</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Neon lights and sharp edges
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500"></div>
                <div className="w-6 h-6 rounded-full bg-pink-500"></div>
                <div className="w-6 h-6 rounded-full bg-purple-700"></div>
              </div>
            </Card>
            
            <Card className="p-4 bg-muted/50">
              <h3 className="font-medium mb-1">Minimal</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Clean and focused design
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                <div className="w-6 h-6 rounded-full bg-slate-400"></div>
                <div className="w-6 h-6 rounded-full bg-slate-200"></div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
