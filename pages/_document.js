import React from 'react';
import Document, { Head as NextHead, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <html>
        <NextHead>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {/* <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=UA-176063384-1`}
          /> */}

          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=${process.env.GOOGLE_TAG_KEY}&gtm_preview=${process.env.GOOGLE_TAG_VAR}&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-T7G2XVT');`,
            }}
          />

          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-176063384-1');
              
            `,
            }}
          /> */}
        </NextHead>
        <body>
          {/*  Google Tag Manager (noscript)  */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=GTM-T7G2XVT&gtm_auth=${process.env.GOOGLE_TAG_KEY}&gtm_preview=${process.env.GOOGLE_TAG_VAR}&gtm_cookies_win=x`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          {/*  End Google Tag Manager (noscript)   */}

          <Main />
          {/* Here we will mount our modal portal */}
          <div id="portal-modal" />
          <NextScript />

          <script src="https://apis.google.com/js/api.js"></script>
          <script src="https://connect.facebook.net/en_US/sdk.js"></script>
        </body>
      </html>
    );
  }
}
