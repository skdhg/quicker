import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { AppProps } from "next/app";
import { DatabaseProvider } from "@/lib/context";

const inter = Inter({ subsets: ["latin"] });

export default function RootApplication({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <DatabaseProvider>
        <Component {...pageProps} />
      </DatabaseProvider>
    </div>
  );
}
