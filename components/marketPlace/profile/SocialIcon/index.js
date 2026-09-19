import React from "react";
import Image from "next/image";

export default function SocialIcon({ SocialList }) {
  return (
    <>
      {SocialList.map(function (object, index) {
        return (
          <button key={index}>
            <Image
              width={20}
              height={20}
              src={object.imageLink}
              loading="lazy"
              alt={"icon"}
            />
          </button>
        );
      })}
    </>
  );
}
