import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Climatology.org</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Climatology!
        </h1>
        
        <h2>A lightweight, minimalist app about all things climate around the world</h2>

        <div className={styles.grid}>
          <Link href="/app">
            <a className={styles.card}>
              <h3>Find a location &rarr;</h3>
              <p>A search engine of climate data for over 120,000 locations </p>
            </a>
          </Link>

          <Link href="/about">
            <a
              className={styles.card}
            >
              <h3>About</h3>
              <p>How this project came to exist.</p>
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
