import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MetaTags from "../metatags";
import { MetaDataArr } from "../constants";

export function PagesLayout({ children, title, description, imagelink }) {
  const router = useRouter();

  const GetPageMetaData = (path) => {
    const pageMetaDes = MetaDataArr.filter((data) => data.url === path);
    return pageMetaDes;
  };
  const metaData = GetPageMetaData(router.asPath);

  return (
    <>
      <MetaTags
        title={metaData && metaData.length > 0 ? metaData[0].title : title}
        description={description}
        imagelink={imagelink}
      ></MetaTags>
      {children}
    </>
  );
}
//metaData[0].title ?? title
