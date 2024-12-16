"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

import { DotButton, useDotButton } from "./carousel/carouselDotButton";
// import Image from "next/image";

type PropType = {
  // slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
  // const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;

    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  // useEffect(() => {
  //   if (emblaApi) {
  //     console.log(emblaApi.slideNodes()); // Access API
  //   }
  // }, [emblaApi]);

  return (
    <section
      ref={emblaRef}
      className="embla flex flex-col items-center justify-center gap-4 h-embla"
    >
      <div className="embla__container">
        <div className="embla__slide">
          <img
            alt="quilt"
            className=""
            // height={1080}
            src="/quilt.jpg"
            // width={1920}
          />
        </div>
        <div className="embla__slide">
          <img
            alt="quilt"
            className=""
            // height={1080}
            src="/horse.jpg"
            // width={1920}
          />
        </div>
        <div className="embla__slide">
          <img
            alt="quilt"
            className=""
            // height={1080}
            src="/goat.jpg"
            // width={1920}
          />
        </div>
      </div>

      <div className="embla__controls w-full flex items-center justify-center">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
