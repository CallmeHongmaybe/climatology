import useSWR from 'swr'
import ExploreIcon from '@material-ui/icons/Explore'
import { Typography, Paper, Tabs, Tab, makeStyles } from '@material-ui/core'
import { useState } from 'react'

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
        alignItems: 'center'
    }
}));

const apiRoot = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = process.env.API_KEY;
const units = '&units=metric';

export default function CityInfo({ country, name }) {
    const [value, setValue] = useState();

    const handleChange = (e, newValue) => {
        console.log(`e.target.value = ${e.target.value}`)
        setValue(newValue);
    };

    const classes = useStyles()

    return (
        <>
            {/* add the tabs here - https://material-ui.com/components/tabs/#centered */}
            <div className={classes.paper}>
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
                        <Tab label="Climate" value="Climate" />
                        <Tab label="Averages" value="Averages" />
                        <Tab label="Basic infos" value="Basic infos" defaultChecked />
                    </Tabs>
                </Paper>
                <InfoPaper option={value} name={name} country={country} />
            </div>
        </>
    )
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

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

function InfoPaper({ option, country, name }) {
    const classes = useStyles()
    const { data, error } = useSWR(`${apiRoot}?q=${name},${country}${apiKey}${units}`, fetcher)

    switch (option) {
        case "Basic infos":
            if (!data) return <Typography align="center" color="primary" variant='body1'>Fetching data...</Typography>
            else if (data) {
                const {
                    main: { temp, feels_like, temp_min, temp_max },
                    weather: [{ main, description, icon }],
                    sys: {sunrise, sunset}, 
                    timezone
                } = data;

                return (
                    <>
                        <Paper>
                            <Typography align="center" color="primary" variant='body1' className={classes.weatherBoard}>
                                <div style={{ flexGrow: 2 }}>
                                    <p style={{ fontSize: '30px', transform: 'scale(1.8)' }}>{Math.floor(temp)}º</p>
                                    <p style={{ fontSize: '20px' }}>{main}</p>
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                </div>
                                <div style={{ flexGrow: 2 }}>
                                    <img src={"http://openweathermap.org/img/w/" + icon + ".png"} style={{ transform: 'scale(1.1)' }} />
                                    <p>Feels like {Math.floor(feels_like)}º</p>
                                    <p>{Math.floor(parseFloat(temp_min))} / {Math.floor(parseFloat(temp_max))}º</p>
                                </div>
                            </Typography>


                        </Paper>
                        <Typography>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 3 }}>
                                <p>Sunrise: </p>
                                <p>{turnUnixToTime(sunrise, timezone)}</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 3 }}>
                                <p>Sunset: </p>
                                <p>{turnUnixToTime(sunset, timezone)}</p>
                            </div>
                        </Typography>
                    </>
                )
            }
            else {
                return <Typography align="center" color="primary" variant='body1'>There seems to be an error. {error}</Typography>
            }
        default: return <div>This is the {option} tab </div>;
    }
}



/* <Typography>
Temp: {!isValidating ? data.main.temp : ""} <br />
Feels like: {!isValidating ? data.main.feels_like : ""}
</Typography> */