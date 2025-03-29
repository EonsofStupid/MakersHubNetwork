
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { frozenZonesAtom } from "@/admin/atoms/tools.atoms";
import { SmartOverlay } from "./SmartOverlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, Plus, Trash, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function FrozenZonesOverlay() {
  const [frozenZones, setFrozenZones] = useAtom(frozenZonesAtom);
  const [newZoneId, setNewZoneId] = useState("");
  const { toast } = useToast();
  
  const handleAddZone = () => {
    if (!newZoneId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a zone ID",
        variant: "destructive"
      });
      return;
    }
    
    // Check if zone already exists
    if (frozenZones.some(zone => zone.id === newZoneId)) {
      toast({
        title: "Error",
        description: `Zone "${newZoneId}" already exists`,
        variant: "destructive"
      });
      return;
    }
    
    setFrozenZones([
      ...frozenZones,
      { id: newZoneId, isLocked: true }
    ]);
    
    setNewZoneId("");
    
    toast({
      title: "Success",
      description: `Zone "${newZoneId}" has been frozen`
    });
  };
  
  const handleToggleZone = (id: string) => {
    setFrozenZones(frozenZones.map(zone => 
      zone.id === id ? { ...zone, isLocked: !zone.isLocked } : zone
    ));
  };
  
  const handleRemoveZone = (id: string) => {
    setFrozenZones(frozenZones.filter(zone => zone.id !== id));
    
    toast({
      title: "Success",
      description: `Zone "${id}" has been removed`
    });
  };
  
  const handleSaveZones = () => {
    // In a real app, this would save to the database
    toast({
      title: "Success",
      description: "Frozen zones configuration has been saved"
    });
  };
  
  return (
    <SmartOverlay
      id="frozen-zones"
      title="Frozen Zones Editor"
      initialPosition={{ x: 100, y: 100 }}
      width={350}
      height={450}
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--impulse-text-secondary)]">
          Lock sections of your page to prevent editing without admin access.
        </p>
        
        <div className="flex gap-2">
          <Input
            value={newZoneId}
            onChange={(e) => setNewZoneId(e.target.value)}
            placeholder="Enter element ID"
            className="flex-1 bg-black/20 border-[var(--impulse-border-normal)]"
          />
          <Button
            size="sm"
            onClick={handleAddZone}
            className="impulse-button"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="border border-[var(--impulse-border-normal)] rounded-md p-2 bg-black/10 min-h-[200px]">
          {frozenZones.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-[var(--impulse-text-secondary)]">
              <Lock className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-sm">No frozen zones yet</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {frozenZones.map((zone) => (
                <li 
                  key={zone.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded",
                    "bg-[rgba(0,240,255,0.1)] border border-[var(--impulse-border-normal)]",
                    zone.isLocked 
                      ? "border-[var(--impulse-primary)]/30" 
                      : "border-[var(--impulse-secondary)]/30"
                  )}
                >
                  <span className="text-[var(--impulse-text-primary)]">
                    #{zone.id}
                  </span>
                  
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleZone(zone.id)}
                      className="h-7 w-7"
                    >
                      {zone.isLocked ? (
                        <Lock className="w-4 h-4 text-[var(--impulse-primary)]" />
                      ) : (
                        <Unlock className="w-4 h-4 text-[var(--impulse-secondary)]" />
                      )}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveZone(zone.id)}
                      className="h-7 w-7"
                    >
                      <Trash className="w-4 h-4 text-[var(--impulse-secondary)]" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <Button 
          className="w-full impulse-button"
          onClick={handleSaveZones}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </SmartOverlay>
  );
}
