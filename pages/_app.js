import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  console.log(pageProps)
  return <Component {...pageProps} />
}

export default MyApp
