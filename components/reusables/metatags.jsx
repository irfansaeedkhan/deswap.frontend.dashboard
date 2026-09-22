import Head from "next/head";

function MetaTags({
  title = "Deswap Platform",
  description = "Official Deswap platform",
  imageLink = "",
  link = "https://deswap.co/",
  sitename = "Deswap Platform",
  keywords = "Deswap Platform, DAW , Deswap Login, Deswap Register",
}) {
  const pageTitle = typeof title === "string" ? title : "Deswap Platform";
  const pageDescription =
    typeof description === "string" && description.trim()
      ? description
      : "Deswap is the first decentralised marketplace to lend loans, collect interest, and mint synthetic stablecoins on Polygon.";
  const pageImage = typeof imageLink === "string" ? imageLink : "";
  const pageLink = typeof link === "string" ? link : "https://deswap.co/";

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={sitename} />
      <meta name="robots" content="all,follow" />
      <meta name="theme-color" content="#1cae9d" />
      <meta name="msapplication-TileColor" content="#1cae9d" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageLink} />
      <meta property="og:site_name" content={sitename} />
      {pageImage ? <meta property="og:image" content={pageImage} /> : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:title" content={pageTitle} />
      {pageImage ? <meta name="twitter:image" content={pageImage} /> : null}

      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default MetaTags;
