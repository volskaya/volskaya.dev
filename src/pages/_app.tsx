import {AppProps} from "next/app";
import Head from "next/head";
import "../styles/globals.scss";

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title key="title">Volskaya - Developer</title>
        <meta key="description" name="description" content="Homepage of a software developer" />
        <link key="favicon" rel="icon" href="/favicon.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
