import ExploreIcon from '@material-ui/icons/Explore'
import { Typography, Paper, Tabs, Tab, makeStyles, ButtonGroup, Button } from '@material-ui/core'
import { useState, useRef, useEffect } from 'react'
import equal from 'fast-deep-equal';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 2,
        backgroundColor: theme.palette.common.white,
        color: 'white',
    },
    paper: {
        display: 'flex', justifyContent: 'center', flexFlow: 'column',
        margin: theme.spacing(4)
    },
    weatherBoard: {
        display: 'flex',
        flexFlow: 'row',
        fontWeight: '700',
        alignItems: 'center',
    },
    sunTime: { display: 'flex', justifyContent: 'space-between', padding: 3 },
    prompt: { fontSize: 20, textAlign: 'center' },
    buttonStyle: (ref, value) => {
        if (ref !== value) return "secondary"
        else return "primary"
    }
}));

const TABS = {
    CLIMATE: 'Climate',
    AVERAGES: 'Monthly averages',
    BASIC_WEATHER: 'Basic forecast',
}

const UNITS = {
    METRIC: 'ºC',
    IMPERIAL: 'ºF',
    KELVIN: 'ºK'
}

const apiRoot = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = process.env.API_KEY;
const units = '&units=metric';

export default function CityInfo({ country, name, lat, lon }) {

    console.log("CityInfo rendered")

    const [value, setValue] = useState();

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    const classes = useStyles()

    return (
        <>
            {/* add the tabs here - https://material-ui.com/components/tabs/#centered */}
            <div align="center" className={classes.paper}>
                <Typography gutterBottom variant="h4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ExploreIcon color="secondary" fontSize="inherit" />
                    {name}, {country}
                </Typography>
                <Paper className={classes.root}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="secondary"
                    >
                        <Tab label={TABS.CLIMATE} value={TABS.CLIMATE} defaultChecked={true} />
                        <Tab label={TABS.AVERAGES} value={TABS.AVERAGES} />
                        <Tab label={TABS.BASIC_WEATHER} value={TABS.BASIC_WEATHER} />
                    </Tabs>
                </Paper>
                {InfoPaper(value, country, name, lat, lon)}
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

function InfoPaper(option, country, name, lat, lon) {
    switch (option) {
        case TABS.BASIC_WEATHER: return <WeatherInfo lat={lat} lon={lon} />
        default: return <div>This is the {option} tab </div>;
    }
}

function WeatherInfo({ lat, lon }) {

    const classes = useStyles()

    const [data, setData] = useState({
        content: null,
        isLoading: false
    })

    const [unit, setUnit] = useState(UNITS.METRIC)

    const prevUnit = useRef(unit)

    const convertTemp = value => {
        switch(unit) {
            case UNITS.METRIC: return Math.floor(value)
            case UNITS.IMPERIAL: return Math.floor((value * 9 / 5) + 32)
            case UNITS.KELVIN: return Math.floor(value + 273.15)
        }
    }

    const handleChange = chosenUnit => {
        prevUnit.current = unit
        setUnit(chosenUnit)
    }

    useEffect(() => {
        setData({ isLoading: true })
        fetch(`${apiRoot}?lat=${lat}&lon=${lon}${apiKey}${units}`)
            .then(res => res.json())
            .then(res => setData({ content: res, isLoading: false }))
            .finally(() => console.log("api called"))
            .catch(error => {
                throw new Error("API sucked. Reason " + error)
            })
    }, [lat, lon])

    if (data.content) {
        const {
            content: {
                main: { temp, feels_like, temp_min, temp_max },
                weather: [{ description, icon }],
                sys: { sunrise, sunset },
                timezone
            }
        } = data;

        return (
            <>
                <Paper>
                    <div className={classes.weatherBoard}>
                        <div style={{ flexGrow: 2 }}>
                            <p style={{ fontSize: '30px', transform: 'scale(1.8)' }}>{convertTemp(temp)}º</p>
                            <p style={{ fontSize: '20px' }}>{description.toUpperCase()}</p>
                        </div>
                        <div style={{ flexGrow: 1 }}>
                        </div>
                        <div style={{ flexGrow: 2 }}>
                            <img src={"http://openweathermap.org/img/w/" + icon + ".png"} style={{ transform: 'scale(1.1)' }} />
                            <p>Feels like {convertTemp(feels_like)}º</p>
                            <p>{convertTemp(temp_min)} / {convertTemp(temp_max)}º</p>
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

                    <ButtonGroup variant="text" color="primary" aria-label="contained primary button group" fullWidth={true} >
                        <Button onClick={() => handleChange(UNITS.KELVIN)}>{UNITS.KELVIN}</Button>
                        <Button onClick={() => handleChange(UNITS.IMPERIAL)}>{UNITS.IMPERIAL}</Button>
                        <Button onClick={() => handleChange(UNITS.METRIC)}>{UNITS.METRIC}</Button>
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
