import { Html, Head, Main, NextScript } from "next/document";
import { poppins } from "../lib/fonts";

export default function Document() {
  return (
    <Html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <Head>
        <meta name="theme-color" content="#0b1220" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
