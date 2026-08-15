import Head from "next/head";
import Link from "next/link";
import { Button } from "@agl/ui";
import styles from "./index.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>AGL Case Study</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>AGL Case Study</h1>
        <p>@agl/ui import check</p>
        <div className={styles.actions}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" isLoading>
            Loading
          </Button>
        </div>
        <Link className={styles.link} href="/contact">
          Contact
        </Link>
      </main>
    </>
  );
}
