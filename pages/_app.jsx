import React from "react";
import { Provider } from "react-redux";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/index.scss";
import { wrapper } from "../redux/store/store";
import { PagesLayout } from "@/components/reusables/layout/allpages";
import "bootstrap/dist/css/bootstrap.min.css";

config.autoAddCss = false;

function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const Layout = Component.PageLayout || React.Fragment;

  return (
    <Provider store={store}>
      <PagesLayout>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PagesLayout>
    </Provider>
  );
}

export default MyApp;
