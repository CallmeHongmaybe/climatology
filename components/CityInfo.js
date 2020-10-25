import ExploreIcon from '@material-ui/icons/Explore'
import { Typography, Paper, Tabs, Tab, ButtonGroup, Button } from '@material-ui/core'
import { useState, useEffect, useContext } from 'react'
import { useStyles } from './Styles'
import MonthAvgGraph from './Graph'
import { ACTIONS, InfoContext } from '../pages/app'
import ClimateCard from './Climate'

const TABS = {
    CLIMATE: 'Climate',
    AVERAGES: 'Monthly averages',
    BASIC_WEATHER: 'Basic forecast',
}

export const UNITS = {
    METRIC: 'ºC',
    IMPERIAL: 'ºF',
    KELVIN: 'ºK'
}

const apiRoot = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = process.env.API_KEY;
const units = '&units=metric';

function CityInfo({ country, name, lat, lng }) {

    console.log("CityInfo rendered")

    const [value, setValue] = useState(TABS.CLIMATE);

    const handleChange = (e, newValue) => {
        e.preventDefault()
        setValue(newValue);
    };

    const classes = useStyles()

    return (
        <>
            <div align="center" className={classes.paper}>
                <div>
                    <Typography gutterBottom variant="h4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ExploreIcon color="secondary" fontSize="inherit" />
                        {name}, {country}
                    </Typography>
                </div>
                <Paper className={classes.root}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="secondary"
                        scrollButtons="auto"
                    >
                        {
                            Object.keys(TABS).map((unit) => {
                                return <Tab key={unit} label={TABS[unit]} value={TABS[unit]} />
                            })
                        }
                    </Tabs>
                </Paper>
                {InfoPaper(value, country, name, lat, lng)}
            </div>
        </>
    )
}

function turnUnixToTime(unixTime, timezone) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date((unixTime + timezone + (new Date().getTimezoneOffset() * 60)) * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2)
}

// use Redis to cache api results 

function InfoPaper(option, country, name, lat, lng) {

    switch (option) {
        case TABS.BASIC_WEATHER: return <WeatherInfo lat={lat} lng={lng} />
        case TABS.AVERAGES: return <MonthAvgGraph country={country} name={name} lat={lat} lng={lng} />
        default: return <ClimateCard lat={lat} lng={lng} country={country} name={name} />;
    }

}

export const convertTemp = (value, unit) => {
    switch (unit) {
        case UNITS.METRIC: return Math.floor(value)
        case UNITS.IMPERIAL: return Math.floor((value * 9 / 5) + 32)
        case UNITS.KELVIN: return Math.floor(value + 273.15)
    }
}

// use Redis or just simply useReducer to cache api results 

function WeatherInfo({ lat, lng }) {
    // useContext goes here

    const { city, dispatch } = useContext(InfoContext)

    const [data, setData] = useState({
        content: null,
        isLoading: true
    })

    const classes = useStyles()
    const [tempUnit, setUnit] = useState(UNITS.METRIC)

    useEffect(() => {
        setData({ isLoading: true })
        if (city.forecast) {
            setData({ content: city.forecast, isLoading: false })
            console.log("Forecast cache used")
        }
        else {
            fetch(`${apiRoot}?lat=${lat}&lon=${lng}${apiKey}${units}`)
                .then(res => res.json())
                .then(res => {
                    setData({ content: res, isLoading: false })
                    dispatch({
                        type: ACTIONS.UPDATE_FORECAST,
                        payload: res
                    })
                })
                .finally(() => console.log("api called"))
                .catch(error => {
                    throw new Error("API sucked. Reason " + error)
                })
        }
    }, [lat, lng])

    if (!data.isLoading) {
        const {
            main: { temp, feels_like, temp_min, temp_max },
            weather: [{ description, icon }],
            sys: { sunrise, sunset },
            timezone
        } = data.content;

        return (
            <>
                <Paper>
                    <div className={classes.weatherBoard}>
                        <div style={{ flexGrow: 2 }}>
                            <p style={{ fontSize: '30px', transform: 'scale(1.8)' }}>{convertTemp(temp, tempUnit)}º</p>
                            <p style={{ fontSize: '20px' }}>{description.toUpperCase()}</p>
                        </div>
                        <div style={{ flexGrow: 1 }}></div>
                        <div style={{ flexGrow: 2 }}>
                            <img src={"http://openweathermap.org/img/w/" + icon + ".png"} style={{ transform: 'scale(1.1)' }} />
                            <p>Feels like {convertTemp(feels_like, tempUnit)}º</p>
                            <p>{convertTemp(temp_min, tempUnit)} / {convertTemp(temp_max, tempUnit)}º</p>
                        </div>
                    </div>
                </Paper>

                <div>
                    <div className={classes.sunTime}>
                        <p>Sunrise: </p>
                        <p>{turnUnixToTime(sunrise, timezone)}</p>
                    </div>
                    <div className={classes.sunTime}>
                        <p>Sunset: </p>
                        <p>{turnUnixToTime(sunset, timezone)}</p>
                    </div>

                    <ButtonGroup variant="text" color="primary" fullWidth={true} >
                        {
                            Object.keys(UNITS).map((unit) => {
                                return <Button
                                    key={unit}
                                    onClick={() => setUnit(UNITS[unit])}
                                    color={(tempUnit === UNITS[unit]) ? 'secondary' : 'primary'}
                                >
                                    {UNITS[unit]}
                                </Button>
                            })
                        }
                    </ButtonGroup>
                </div>
            </>
        )
    }
    else if (data.isLoading) return (
        <p className={classes.prompt}>...Loading</p>
    )
    else return (
        <p className={classes.prompt}>There might have been something wrong</p>
    )
}

export default CityInfo



// make use of useReducer and https://reactjs.org/docs/context.html to store data because without it every time you click on a tab it keeps making API calls. 
// after you finish the component, make sure to test the live database not the local one. 
