import { EmblaOptionsType } from "embla-carousel";

import EmblaCarousel from "../carousel";

const OPTIONS: EmblaOptionsType = { loop: true };

export const Hero = () => {
  return <EmblaCarousel options={OPTIONS} />;
};
