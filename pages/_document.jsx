import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0b1220" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://deswap.s3.eu-west-3.amazonaws.com" />
        <link rel="dns-prefetch" href="https://deswap.s3.eu-west-3.amazonaws.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
