import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '../../ui/carousel';

interface EventCardsMobileCarouselProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

export function EventCardsMobileCarousel({
  children,
  ariaLabel = 'Prihajajoči dogodki',
}: EventCardsMobileCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setSelectedIndex(carouselApi.selectedScrollSnap());
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;

    setSlideCount(api.scrollSnapList().length);
    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  const slides = React.Children.toArray(children);

  return (
    <div className="event-cards-carousel">
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', containScroll: 'trimSnaps' }}
        aria-label={ariaLabel}
        className="event-cards-carousel__root"
      >
        <CarouselContent className="event-cards-carousel__track">
          {slides.map((slide, index) => (
            <CarouselItem
              key={(slide as React.ReactElement).key ?? index}
              className="event-cards-carousel__slide"
            >
              {slide}
            </CarouselItem>
          ))}
        </CarouselContent>

        {canScrollPrev && (
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="event-cards-carousel__nav event-cards-carousel__nav--prev"
            aria-label="Prejšnja kartica"
          >
            <ChevronLeft aria-hidden />
          </button>
        )}

        {canScrollNext && (
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="event-cards-carousel__nav event-cards-carousel__nav--next"
            aria-label="Naslednja kartica"
          >
            <ChevronRight aria-hidden />
          </button>
        )}
      </Carousel>

      {slideCount > 1 && (
        <div className="event-cards-carousel__dots" role="tablist" aria-label="Izberi kartico">
          {Array.from({ length: slideCount }, (_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Kartica ${index + 1}`}
              className={`event-cards-carousel__dot${index === selectedIndex ? ' is-active' : ''}`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
