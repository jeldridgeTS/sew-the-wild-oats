import Link from "next/link";

import { FacebookIcon } from "./icons/facebookIcon";
import { InstagramIcon } from "./icons/instagramIcon";
import { TwitterIcon } from "./icons/twitterIcon";

export default function Footer() {
  return (
    <section className="bg-white">
      <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          <div className="px-5 py-2">
            <Link
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
              href="#"
            >
              About
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
              href="#"
            >
              Products
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
              href="#"
            >
              Services
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
              href="#"
            >
              Contact
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              className="text-base leading-6 text-gray-500 hover:text-gray-900"
              href="#"
            >
              Blog
            </Link>
          </div>
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
