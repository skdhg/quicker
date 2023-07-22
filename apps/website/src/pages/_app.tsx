import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppProps } from "next/app";
import { DatabaseProvider } from "@/lib/context";

const inter = Inter({ subsets: ["latin"] });

export default function RootApplication({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <ThemeProvider>
        <DatabaseProvider>
          <Component {...pageProps} />
        </DatabaseProvider>
      </ThemeProvider>
    </div>
  );
}
