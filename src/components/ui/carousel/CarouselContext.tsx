import * as React from "react";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type CarouselApi = UseEmblaCarouselType[1];
type EmblaRefType = UseEmblaCarouselType[0];

type CarouselProps = {
  opts?: Record<string, any>;
  plugins?: any[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: EmblaRefType;
  api: CarouselApi | undefined;
  opts?: Record<string, any>;
  orientation?: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

export const CarouselContext = React.createContext<CarouselContextProps | null>(
  null
);

export function useCarousel(): CarouselContextProps {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <CarouselContext.Provider />");
  }

  return context;
}

export type { CarouselApi, CarouselProps };
