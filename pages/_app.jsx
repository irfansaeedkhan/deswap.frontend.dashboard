import React from "react";
import { Provider } from "react-redux";
import { Poppins } from "next/font/google";
import { wrapper } from "../redux/store/store";
import { PagesLayout } from "@/components/reusables/layout/allpages";
import "../styles/core.scss";
import "../styles/marketing.scss";
import "../styles/auth.scss";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const Layout = Component.PageLayout || React.Fragment;

  return (
    <Provider store={store}>
      <div className={`${poppins.variable} ${poppins.className}`}>
        <PagesLayout>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PagesLayout>
      </div>
    </Provider>
  );
}

export default MyApp;
