import dynamic from 'next/dynamic';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import CityInfo from '../components/CityInfo';
import { useReducer, createContext, useMemo, useEffect } from 'react'
import fetch from 'isomorphic-fetch'
// import ls from 'local-storage'

const origin = process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "https://weather-advisor2.vercel.app";

// geoJSON docs: https://tools.ietf.org/html/rfc7946 
// geoJSON charter: https://datatracker.ietf.org/wg/geojson/charter/
// css: https://medium.com/dvt-engineering/css-flexboxs-a-useful-alternative-to-div-and-float-551c98d26aeb

// ALWAYS CONSULT THESE EXAMPLES BEFORE MOVING ON: https://github.com/vercel/next.js/tree/master/examples

const NoSSRMap = dynamic(() => import('../components/Map'), {
    ssr: false
});

export const ACTIONS = {
    GET_CITY_INFO: "getCityInfo",
    UPDATE_FORECAST: "UpdateForecast",
    UPDATE_CLIMATE: "UpdateClimate",
    TOGGLE_LAYER: "EnableLayers"
}

function reducer(info, { type, payload }) {
    switch (type) {
        case ACTIONS.GET_CITY_INFO:
            return { ...payload }
        case ACTIONS.UPDATE_CLIMATE:
            return { ...info, climate: payload.climate, averages: payload.averages }
        case ACTIONS.UPDATE_FORECAST:
            return { ...info, forecast: payload }
        case ACTIONS.TOGGLE_LAYER:
            return { ...info, show_layer: !info.show_layer }
        default: return info
    }
}

export const InfoContext = createContext()

// https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation 

export default function App() {

    const [city, dispatch] = useReducer(reducer, {
        country: "AU",
        name: "Sydney",
        lat: -33.86785,
        lng: 151.20732, 
        climate: null, 
        averages: null, 
        forecast: null,
        show_layer: false
    })

    const memoizedValues = useMemo(() => {
        return { city, dispatch }
    }, [city, dispatch])

    // used in conjunction with useContext: https://hswolff.com/blog/how-to-usecontext-with-usereducer/
    // memoized values only change when either of these 2 deps actually changes () by refs ). 

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
            <Head>
                <title>Weather advisor 2</title>
            </Head>
            <InfoContext.Provider value={memoizedValues}>
                <div style={{ width: '45vw' }}>
                    <SearchBar />
                    <CityInfo {...city} />
                </div>
                <NoSSRMap />
            </InfoContext.Provider>
        </div>
    )
}

// export async function getStaticProps() {

//     // steps 
//     // 3. Cache with localStorage
//     // 3. export the document

//     const getLocation = await fetch(`${origin}/api/geolocate`)
//     const location = await getLocation.json()

//     const [{ _id, country, name, location: { coordinates: [lng, lat] }, climate, distance, ...averages }] = location

//     return {
//         props: {
//             country, name, lat, lng, climate, 
//             averages: (() => {
//                 let arry = []

//                 for (let month in averages) {
//                     const { max, min } = averages[month]
//                     arry.push({
//                         name: month,
//                         Low: min,
//                         High: max
//                     })
//                 }
//                 return arry
//             })()
//         }
//     }
// }
