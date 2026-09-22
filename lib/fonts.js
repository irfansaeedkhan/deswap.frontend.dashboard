import { Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
  adjustFontFallback: true,
  preload: true,
  variable: "--font-poppins",
});
