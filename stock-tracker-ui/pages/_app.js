import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Component {...pageProps} />
      </main>
    </>
  );
}
