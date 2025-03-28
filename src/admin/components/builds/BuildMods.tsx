
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { BuildMod } from "@/admin/types/build.types";

interface BuildModsProps {
  mods: BuildMod[];
}

export function BuildMods({ mods }: BuildModsProps) {
  if (!mods || mods.length === 0) {
    return (
      <div className="rounded-md bg-muted/50 p-8 flex flex-col items-center justify-center gap-2">
        <Wrench className="w-8 h-8 text-muted-foreground" />
        <p className="text-muted-foreground">No modifications in this build</p>
      </div>
    );
  }
  
  const getComplexityColor = (score: number) => {
    if (score <= 2) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (score <= 4) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-rose-500/10 text-rose-500 border-rose-500/20";
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Modifications</h3>
      <div className="grid grid-cols-1 gap-4">
        {mods.map((mod) => (
          <Card key={mod.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{mod.name}</h4>
              <Badge 
                variant="outline" 
                className={`${getComplexityColor(mod.complexity)}`}
              >
                Complexity: {mod.complexity}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {mod.description || "No description provided"}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
