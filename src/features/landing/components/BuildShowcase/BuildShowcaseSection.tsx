
import React from 'react';
import { useAtomValue } from 'jotai';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { BuildCard } from './BuildCard';
import { featuredBuildsAtom } from '../../atoms';

export const BuildShowcaseSection: React.FC = () => {
  const builds = useAtomValue(featuredBuildsAtom);

  return (
    <section className="showcase-section">
      <div className="container mx-auto px-4">
        <h2 className="showcase-title">
          <span className="showcase-title-gradient">
            Featured Builds
          </span>
        </h2>
        
        <p className="showcase-description">
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
              {builds.map((build) => (
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
          <a href="/builds" className="showcase-cta">
            View All Builds
          </a>
        </div>
      </div>
    </section>
  );
};
