import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import {
  TwitterIcon,
  StwoIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/icons";

export const Navbar = () => {
  return (
    <NextUINavbar
      className="py-1.5"
      height="6rem"
      maxWidth="xl"
      position="static"
    >
      <NavbarContent>
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <StwoIcon />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        <ul className="hidden lg:flex gap-24 justify-start">
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              key={item.href}
              className="group transition duration-300"
            >
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground", size: "lg" }),
                  "data-[active=true]:text-secondary data-[active=true]:font-medium italic hover:text-linkHover"
                )}
                color="foreground"
                href={item.href}
                style={{ fontSize: "x-large" }}
              >
                {item.label}
              </NextLink>
              <span className="block scale-x-0 group-hover:scale-x-100 transition-all duration-300 h-0.5 bg-linkHover" />
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" size={36} />
          </Link>
          <Link
            isExternal
            aria-label="Facebook"
            href={siteConfig.links.discord}
          >
            <FacebookIcon className="text-default-500" size={36} />
          </Link>
          <Link
            isExternal
            aria-label="Instagram"
            href={siteConfig.links.github}
          >
            <InstagramIcon className="text-default-500" size={36} />
          </Link>
          {/* <ThemeSwitch /> */}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {/* <ThemeSwitch /> */}
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
