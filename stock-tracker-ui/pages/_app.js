import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#050b14" />
      </Head>
      <Navbar />
      <main className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <Component {...pageProps} />
      </main>
    </>
  );
}
