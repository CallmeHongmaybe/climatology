import dynamic from 'next/dynamic';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import CityInfo from '../components/essentials/CityInfo';
import { useReducer, createContext, useMemo } from 'react'

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

export default function App() {

    const [city, dispatch] = useReducer(reducer, {
        _id: "5f7967928cea559a7e9cf062", 
        country: "CA",
        name: "Calgary",
        lat: 51.05011,
        lng: -114.08529,
        climate: null, 
        averages: [], 
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
