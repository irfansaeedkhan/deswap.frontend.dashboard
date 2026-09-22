import React from "react";
import Head from "next/head";

export function FormsLayout({ children }) {
  return (
    <div className="formsPage">
      <Head>
        <link rel="preload" href="/css/dashboard.css" as="style" />
      </Head>
      <main>{children}</main>
    </div>
  );
}
