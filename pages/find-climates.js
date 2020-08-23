
import dynamic from 'next/dynamic';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import CityInfo from '../components/CityInfo';

// geoJSON docs: https://tools.ietf.org/html/rfc7946 
// geoJSON charter: https://datatracker.ietf.org/wg/geojson/charter/

// css: https://medium.com/dvt-engineering/css-flexbox-a-useful-alternative-to-div-and-float-551c98d26aeb

const NoSSRMap = dynamic(() => import('../components/Map'), {
    ssr: false
}); // listens to commands from this component


// function reducer(state, { type, payload }) {
//     switch (type) {
//         case ACTIONS.FLYTO: return { lat: payload.lat, lon: payload.lon }
//         default: return state;
//     }
// }

export default function App() {
    // const [state, dispatch] = useReducer(reducer, { lat: -33.87, lon: 151 })
    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
            <Head>
                <title>Find dem climates</title>
            </Head>
            <div style={{width: '40vw'}}>
                <SearchBar />
                <CityInfo />
            </div>
            <NoSSRMap />
        </div>
    )
}