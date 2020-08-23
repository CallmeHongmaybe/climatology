import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Weather Advisor
        </h1>

        <div className={styles.grid}>
          <Link href="/climate">
            <a className={styles.card}>
              <h3>Know thy climates &rarr;</h3>
              <p>Play with the sliders</p>
            </a>
          </Link>

          <Link href="/find-climates">
            <a className={styles.card}>
              <h3>Find thy climates &rarr;</h3>
              <p>Look for all cities with similar weather patterns</p>
            </a>
          </Link>

          <Link href="/map">
            <a
              className={styles.card}
            >
              <h3>See map layers &rarr;</h3>
              <p>Discover different layers gathered from our data</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
