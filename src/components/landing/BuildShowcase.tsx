import React from "react";
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useSiteTheme } from "@/components/theme/SiteThemeProvider";

// Sample data - in a real implementation, this would come from an API
const FEATURED_BUILDS = [
  {
    id: "build-1",
    title: "Ender 3 V2 Dual Z-Axis Mod",
    creator: "PrintMaster3000",
    imageUrl: "https://images.unsplash.com/photo-1615412704911-55ca9cffdca9?q=80&w=640",
    category: "Modification",
    likes: 342,
    views: 1245
  },
  {
    id: "build-2",
    title: "Prusa i3 MK3S+ Enclosure",
    creator: "3DCreator",
    imageUrl: "https://images.unsplash.com/photo-1611117775350-ac3950990985?q=80&w=640",
    category: "Enclosure",
    likes: 278,
    views: 982
  },
  {
    id: "build-3",
    title: "CR-10 Direct Drive Conversion",
    creator: "PrintingPro",
    imageUrl: "https://images.unsplash.com/photo-1593106410886-d48cb1a7a47f?q=80&w=640",
    category: "Upgrade",
    likes: 412,
    views: 1567
  },
  {
    id: "build-4",
    title: "Voron 2.4 Full Build",
    creator: "VoronEnthusiast",
    imageUrl: "https://images.unsplash.com/photo-1612282131293-37332d3cea00?q=80&w=640",
    category: "Complete Build",
    likes: 587,
    views: 2143
  }
];

export const BuildShowcase = () => {
  return (
    <section className="py-16 bg-background/30 backdrop-blur-sm relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Featured Builds
          </span>
        </h2>
        
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Check out these amazing 3D printer builds from our community. Get inspired and start creating your own custom builds today.
        </p>
        
        <div className="mt-8 relative px-10">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {FEATURED_BUILDS.map((build) => (
                <CarouselItem key={build.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4">
                  <BuildCard build={build} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="/builds" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary/20 text-primary-foreground 
                       border border-primary/30 hover:bg-primary/30 transition-colors duration-300
                       shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
          >
            View All Builds
          </a>
        </div>
      </div>
    </section>
  );
};

interface BuildCardProps {
  build: {
    id: string;
    title: string;
    creator: string;
    imageUrl: string;
    category: string;
    likes: number;
    views: number;
  };
}

// Update the BuildCard component to use the theme from the database
const BuildCard = ({ build }: BuildCardProps) => {
  const { componentStyles } = useSiteTheme();
  const styles = componentStyles?.BuildCard || {
    container: "overflow-hidden rounded-lg border border-primary/20 bg-background/40 shadow-lg hover:shadow-xl transition-all duration-300 h-full",
    image: "w-full h-full object-cover transition-transform duration-500 hover:scale-110",
    overlay: "absolute inset-0 bg-gradient-to-t from-background to-transparent",
    category: "inline-block px-2 py-1 text-xs rounded-md backdrop-blur-md bg-primary/30 text-primary-foreground border border-primary/40"
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={cn(styles.container)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={build.imageUrl} 
          alt={build.title} 
          className={cn(styles.image)}
        />
        <div className={cn(styles.overlay)}></div>
        <div className="absolute bottom-2 left-2">
          <span className={cn(styles.category)}>
            {build.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{build.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">by {build.creator}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{build.likes} likes</span>
          <span>{build.views} views</span>
        </div>
      </div>
    </motion.div>
  );
};
