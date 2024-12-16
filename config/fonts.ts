import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Caladea as FontCaladea,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontCaladea = FontCaladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
