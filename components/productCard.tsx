import Link from "next/link";
// eslint-disable-next-line import/order
import clsx from "clsx";

// import { ToteBageIcon } from "./icons";

import Image from "next/image";

import { fontCaladea } from "@/config/fonts";
import SvgImgCircle from "@/components/svgImgCircle";

export default function ProductCard() {
  return (
    <div
      className={`border-4 border-solid border-primary w-auto h-auto rounded-2xl bg-white`}
    >
      <div
        className="flex flex-col items-center justify-between pt-9 px-6 pb-6 relative"
        style={{ position: "relative" }}
      >
        <span className="relative mx-auto -mt-16 mb-8">
          {/* <ToteBageIcon /> */}
          <SvgImgCircle />
          <Image
            alt="Your Image"
            height={100}
            objectFit="cover"
            src="/static/images/toteBag.png"
            style={{ width: "60%", height: "auto", position: "relative" }}
            width={100}
          />
        </span>
        <h5
          className={clsx(
            "text-large italic mb-2 text-left mr-auto text-zinc-700",
            fontCaladea.className,
          )}
        >
          Products
        </h5>
        <p className="w-full mb-4 text-sm text-justify">
          We process your personal information to measure and improve our sites
          and services, to assist our campaigns and to provide personalised
          content.
          <br />
          For more information see our
          <Link
            className="mb-2 text-sm cursor-pointer font-semibold transition-colors hover:text-[#634647] underline underline-offset-2"
            href={"#"}
          >
            Privacy Policy
          </Link>
        </p>
        <button className="mb-2 text-sm mr-auto text-zinc-600 cursor-pointer font-semibold transition-colors hover:text-[#634647] hover:underline underline-offset-2">
          More Options
        </button>
        <button
          className="absolute font-semibold right-6 bottom-6 cursor-pointer py-2 px-8 w-max break-keep text-sm rounded-lg transition-colors text-[#634647] hover:text-[#ddad81] bg-[#ddad81] hover:bg-[#634647]"
          type="button"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
