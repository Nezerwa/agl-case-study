import "@/globals.css";
import type { AppProps } from "next/app";
import { inter } from "@/config/fonts";
import { SiteLayout } from "@/components/SiteLayout/SiteLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable}>
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </div>
  );
}
