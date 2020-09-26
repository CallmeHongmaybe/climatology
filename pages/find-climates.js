
import dynamic from 'next/dynamic';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import CityInfo from '../components/CityInfo';
import { useReducer } from 'react'

// geoJSON docs: https://tools.ietf.org/html/rfc7946 
// geoJSON charter: https://datatracker.ietf.org/wg/geojson/charter/
// css: https://medium.com/dvt-engineering/css-flexbox-a-useful-alternative-to-div-and-float-551c98d26aeb

const NoSSRMap = dynamic(() => import('../components/Map'), {
    ssr: false
});

export const ACTIONS = {
    GET_CITY_INFO: "getCityInfo",
    UPDATE_INFO: 'updateName'
}

function reducer(city, { type, payload }) {
    switch (type) {
        case ACTIONS.GET_CITY_INFO:
            return { ...payload }
        default: return city
    }
}

export default function App() {
    const [city, dispatch] = useReducer(reducer, {
        country: "AU",
        name: "Sydney",
        lat: -33.87,
        lon: 151
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
            <Head>
                <title>Find dem climates</title>
            </Head>
            <div style={{ width: '40vw' }}>
                <SearchBar dispatch={dispatch} />
                <CityInfo {...city}/>
            </div>
            <NoSSRMap city={JSON.stringify(city)} dispatch={dispatch}/>
        </div>
    )
}

// https://material-ui.com/components/steppers/ Steppers for the "find similar climate" prompt 
// use chip arrays to indicate country inputs like I did in WA 1 - https://material-ui.com/components/chips/#chip-array