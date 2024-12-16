import NextLink from "next/link";
import clsx from "clsx";
import { link as linkStyles } from "@nextui-org/theme";

import { FacebookIcon } from "./icons/facebookIcon";
import { InstagramIcon } from "./icons/instagramIcon";
import { TwitterIcon } from "./icons/twitterIcon";

import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <section className="bg-background">
      <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          {siteConfig.footerNavItems.map((item) => (
            <NextLink
              key={item.href}
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary hover:text-primary-700 data-[active=true]:font-medium px-5 py-2"
              )}
              color="foreground"
              href={item.href}
            >
              {item.label}
            </NextLink>
          ))}
        </nav>
        <div className="flex justify-center mt-8 space-x-6">
          <FacebookIcon />
          <InstagramIcon />
          <TwitterIcon />
        </div>
        <p className="mt-8 text-base leading-6 text-center text-gray-400">
          © Sew the Wild Oats, LLC.
        </p>
      </div>
    </section>
  );
}
