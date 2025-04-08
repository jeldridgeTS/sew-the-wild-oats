import { Hero } from "@/components/hero";
import ProductServiceTabs from "@/components/productServiceTabs";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductServiceTabs />
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
