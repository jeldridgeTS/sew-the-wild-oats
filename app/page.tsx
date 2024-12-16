import { Hero } from "@/components/hero";
import ServicesSection from "@/components/servicesSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
    </>
  );
}

{
  /* <Link
  isExternal
  className={buttonStyles({
    color: "primary",
    radius: "full",
    variant: "shadow",
  })}
  href={siteConfig.links.docs}
>
  Documentation
</Link>; */
}
