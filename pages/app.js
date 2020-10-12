import dynamic from 'next/dynamic';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import CityInfo from '../components/CityInfo';
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
}

function reducer(info, { type, payload }) {
    switch (type) {
        case ACTIONS.GET_CITY_INFO:
            return { ...payload }
        case ACTIONS.UPDATE_CLIMATE:
            return { ...info, climate: payload.climate, averages: payload.averages }
        case ACTIONS.UPDATE_FORECAST:
            return { ...info, forecast: payload }
        default: return info
    }
}

export const InfoContext = createContext()

export default function App() {

    const [city, dispatch] = useReducer(reducer, {
        country: "AU",
        name: "Sydney",
        lat: -33.86785,
        lng: 151.20732,
        climate: null,
        averages: null,
        forecast: null,
    })

    const memoizedValues = useMemo(() => {
        return { city, dispatch }
    }, [city, dispatch])

    // used in conjunction with useContext: https://hswolff.com/blog/how-to-usecontext-with-usereducer/
    // memoized values only change when either of these 2 deps actually changes () by refs ). 

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
            <Head>
                <title>Find dem climates</title>
            </Head>
            <div style={{ width: '45vw' }}>
                <SearchBar dispatch={dispatch} />
                <InfoContext.Provider value={memoizedValues}>
                    <CityInfo {...city} />
                </InfoContext.Provider>

            </div>
            <NoSSRMap lat={city.lat} lng={city.lng} dispatch={dispatch} />
        </div>
    )
}

// export async function getServerSideProps(ctx) {

//     var keys = ["country", "name", "lat", "lng"]
//     const values = (ctx.query.place).split("_") || undefined

//     const zipKeysAndValues = keys => values => keys.reduce( (obj, key, i) => ({ ...obj, [key]: values[i] }), {})

//     return {
//         props: values ? zipKeysAndValues(keys)(values) : {
//             country: "AU",
//             name: "Sydney",
//             lat: -33.86785,
//             lng: 151.20732
//         } // or geolocation 
//     }  // treat this as a hashtag like : https://sth.org/#
// }


// climate icon: 
// catalog: Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
// climate extremes: Icons made by <a href="https://www.flaticon.com/authors/surang" title="surang">surang</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
// country by climate: Icons made by <a href="https://www.flaticon.com/authors/eucalyp" title="Eucalyp">Eucalyp</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>





// why do we need routes: To lazy load of course. You can't just load all JS files like the last time you did it. 

// use chip arrays to indicate country inputs like I did in WA 1 - https://material-ui.com/components/chips/#chip-array