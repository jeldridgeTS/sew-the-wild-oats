"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";
import Image from "next/image";

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  // const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  return (
    <section ref={emblaRef} className="embla">
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
    </section>
  );
}
