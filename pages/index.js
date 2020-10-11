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
          Welcome to Weather Advisor!
        </h1>
        
        <h2>The go-to app for climate stuff across the world</h2>

        <div className={styles.grid}>
          <Link href="/app">
            <a className={styles.card}>
              <h3>Find a location &rarr;</h3>
              <p>If you already have a vacation spot or a city in mind, I would recommend using this tool. You can find climate info for any location in the search bar</p>
            </a>
          </Link>

          <Link href="/climate-extremes">
            <a
              className={styles.card}
            >
              <h3>Climate extremes &rarr;</h3>
              <p>A curated list of climate outliers observed around the world.</p>
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
