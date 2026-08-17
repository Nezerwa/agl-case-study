import Head from "next/head";
import Link from "next/link";
import styles from "./index.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>SOGECO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.main}>
        <h1 className={styles.title}>SOGECO</h1>
        <p>Filiale du groupe Africa Global Logistics</p>
        <Link className={styles.link} href="/actualites">
          Actualités
        </Link>
      </div>
    </>
  );
}
