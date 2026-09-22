import React, { useEffect } from "react";
import PageLoader from "./PageLoader";

function Loader(data) {
  const loading = data.loading !== false;

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;
    if (loading) {
      body.classList.add("stopScrolling");
    } else {
      body.classList.remove("stopScrolling");
    }
    return () => {
      body.classList.remove("stopScrolling");
    };
  }, [loading]);

  if (!loading) return null;

  return <PageLoader overlay title={data.title || ""} />;
}

export default Loader;
