// import useSWR from 'swr'
import ExploreIcon from '@material-ui/icons/Explore'
import { Typography } from '@material-ui/core'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const apiRoot = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = process.env.API_KEY;
const units = '&units=metric';

export default function CityInfo() {
    // const { data, error } = useSWR(`${apiRoot}?q=Sydney,AU${apiKey}${units}`, fetcher)

    // console.log(data || error)

    console.log("CityInfo rerenders")

    return (
        <>
            <div style={{ width: 'inherit', display: 'flex', justifyContent: 'center' }}>
                <Typography gutterBottom variant="h4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ExploreIcon color="secondary" fontSize="inherit" />
                    {`Sydney, AU`}
                </Typography>
            </div>
            {/* <Typography>
                {data ? data.main.temp : ""}
            </Typography> */}
        </>
    )
}