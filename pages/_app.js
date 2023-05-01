import React from 'react';
import App from 'next/app';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import Head from 'next/head';
import * as Sentry from '@sentry/browser';
import { theme } from 'util/config';
import withReduxStore from 'redux/withReduxStore';
import AppGlobalComponent from 'containers/App';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'assets/styles/main.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

Sentry.init({ dsn: process.env.SENTRY_DNS_KEY });

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });

    super.componentDidCatch(error, errorInfo);
  }
  componentDidMount() {}

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:url" content="https://thrivr.ca/" />
          <meta property="og:site_name" content="Thrivr" />
          {pageProps?.massageData?.profile_photo ? (
            <meta
              property="og:image"
              content={pageProps?.massageData?.profile_photo}
            />
          ) : (
            <meta property="og:image" content="/images/Thrivr_2.png" />
          )}
        </Head>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Component {...pageProps} />
            <AppGlobalComponent />
          </Provider>
        </ThemeProvider>
      </>
    );
  }
}

export default withReduxStore(MyApp);
