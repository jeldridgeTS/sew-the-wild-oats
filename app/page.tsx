// import { button as buttonStyles } from "@nextui-org/theme";

import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <Hero />
    </section>
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
