import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const Paths = ["", "/", "/about", "/tokenomics", "/ecosystem", "/metaverse", "/explorecollections"];
  const router = useRouter();
  let showHeaderFooter = Paths.includes(router.pathname);

  useEffect(() => {
    /*
    document.onkeydown = function(e) {
      if(e.keyCode == 123) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
         return false;
      }
      if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
         return false;
      }
    };
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });*/
  }, []);
  return (
    <>
      <Head>
        <title>Deswap</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        ></meta>
      </Head>
      {showHeaderFooter && <Navbar />}

      <div id={"layoutContainer"} onContextMenu={() => {return false}}>
        {children}
        {showHeaderFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;
