
import React, { useEffect, useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { supabase } from '@/integrations/supabase/client';

interface PrinterPart {
  id: string;
  name: string;
  description: string;
  images: string[];
  slug: string;
  community_score: number;
  manufacturer?: {
    name: string;
    logo_url?: string;
  };
}

interface DBSectionProps {
  className?: string;
}

export function DBSection({ className }: DBSectionProps) {
  const [parts, setParts] = useState<PrinterPart[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadParts() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('printer_parts')
          .select(`
            id, 
            name, 
            description, 
            images, 
            slug, 
            community_score, 
            manufacturer:manufacturers(name, logo_url)
          `)
          .order('community_score', { ascending: false })
          .limit(4);
          
        if (error) throw error;
        setParts(data as PrinterPart[]);
      } catch (error) {
        console.error('Error loading printer parts:', error);
        // Fallback content
        setParts([
          {
            id: '1',
            name: 'E3D V6 Hotend',
            description: 'Industry standard hotend with great reliability',
            images: ['/images/placeholder-1.jpg'],
            slug: 'e3d-v6',
            community_score: 4.7,
            manufacturer: { name: 'E3D' }
          },
          {
            id: '2',
            name: 'Bondtech BMG Extruder',
            description: 'Dual drive geared extruder for precise filament control',
            images: ['/images/placeholder-2.jpg'],
            slug: 'bondtech-bmg',
            community_score: 4.9,
            manufacturer: { name: 'Bondtech' }
          },
          {
            id: '3',
            name: 'SKR Mini E3 V3',
            description: '32-bit control board with silent stepper drivers',
            images: ['/images/placeholder-3.jpg'],
            slug: 'skr-mini-e3-v3',
            community_score: 4.5,
            manufacturer: { name: 'BIGTREETECH' }
          },
          {
            id: '4',
            name: 'PEI Spring Steel Sheet',
            description: 'Flexible build surface with excellent adhesion',
            images: ['/images/placeholder-1.jpg'],
            slug: 'pei-spring-steel',
            community_score: 4.8,
            manufacturer: { name: 'Energetic' }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadParts();
  }, []);

  if (isLoading) {
    return (
      <section className={cn("py-16 container mx-auto", className)}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Top-Rated Parts</h2>
          <div className="h-2 w-40 bg-primary/20 mx-auto rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-72 bg-muted/40 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 container mx-auto", className)}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Top-Rated Parts</h2>
        <p className="text-muted-foreground">Community favorites for your next build</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {parts.map((part) => (
          <a 
            key={part.id}
            href={`/parts/${part.slug}`}
            className="block overflow-hidden rounded-lg border border-primary/10 bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 group"
          >
            <div className="h-40 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${part.images?.[0] || '/images/placeholder-1.jpg'})` }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                  {part.name}
                </h3>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{part.community_score}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{part.description}</p>
              {part.manufacturer && (
                <div className="text-xs text-muted-foreground">
                  By: {part.manufacturer.name}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <a 
          href="/parts" 
          className={cn(
            "inline-flex items-center justify-center",
            "px-6 py-2.5 rounded border border-primary/30",
            "hover:bg-primary/10 transition-colors"
          )}
        >
          View All Parts
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
