
import { useState } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/core/accordion";
import { Badge } from "@/ui/core/badge";

export function ThemeTokenTab() {
  const { tokens } = useThemeStore();
  const [filter, setFilter] = useState<string | null>(null);
  
  const tokensByCategory = Object.values(tokens || {}).reduce((acc, token) => {
    const category = token.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(token);
    return acc;
  }, {} as Record<string, any[]>);
  
  const filteredCategories = filter 
    ? Object.keys(tokensByCategory).filter(cat => cat.includes(filter.toLowerCase()))
    : Object.keys(tokensByCategory);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(tokensByCategory).map(category => (
          <Badge 
            key={category}
            variant={filter === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter(filter === category ? null : category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      <Accordion type="multiple" className="w-full">
        {filteredCategories.map(category => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-sm">
              {category} <span className="text-muted-foreground ml-2">({tokensByCategory[category].length})</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {tokensByCategory[category].map(token => (
                  <div key={token.id} className="flex items-center gap-2">
                    {token.category === 'colors' && (
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: token.value }}
                      />
                    )}
                    <span className="text-xs font-mono">{token.name}</span>
                    <span className="text-xs text-muted-foreground font-mono ml-auto">
                      {token.value}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
