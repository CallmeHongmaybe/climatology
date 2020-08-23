import dynamic from 'next/dynamic';
import Head from 'next/head';

// geoJSON docs: https://tools.ietf.org/html/rfc7946 
// geoJSON charter: https://datatracker.ietf.org/wg/geojson/charter/

export default function App() {
    const NoSSRMap = dynamic(() => import('../components/Map'), {
        ssr: false
    });

    return (
        <div>
            <Head>
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v0.51.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>
            <NoSSRMap/>
        </div>
    )
}
