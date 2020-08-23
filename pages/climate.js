import { Grid, TextField, MenuItem } from '@material-ui/core';
import {Range} from 'rc-slider'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThermometerFull, faWater, faWind, faMountain, faCloudRain } from '@fortawesome/free-solid-svg-icons'
import koppenReader from '../library/koppen.json'
import getKoppen from '../public/getImg'

// http://212.64.170.28:81/arcgis/rest/services/RB/Temporales_vectoriales/MapServer/9
// http://koeppen-geiger.vu-wien.ac.at/present.htm

/* function toFahrenheit(temp) {
        const res = (temp * 9 / 5 ) + 32; 
        return Math.floor(res) + ' ºF '; 
} */

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
        padding: theme.spacing(3),
        color: 'skyblue',
        borderRight: '1px solid #aaa'
    },
    header: {
        textAlign: 'center',
        padding: theme.spacing(2),
        fontSize: '23px',
        color: 'white',
        width: '100vw'
    },
    stats: {
        padding: 10,
        borderBottom: '1px solid #aaa',
        height: 'fit-content',
        lineHeight: '1.1',
        color: 'blue',
        fontSize: '1.1em',
        fontFamily: "'Nunito', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    }, 
    map: {
        alignSelf: 'center', 
    }
}));

const listOfHotMonths = [
    {
        value: 1,
        label: 1,
    },
    {
        value: 2,
        label: 2,
    },
    {
        value: 3,
        label: 3,
    },
    {
        value: 4,
        label: 4,
    },
    {
        value: 5,
        label: 5,
    },
    {
        value: 6,
        label: 6,
    },
];

const listOfSeasons = [
    {
        value: 0,
        label: "Most of the rain will pour during the summer half (1)",
    },
    {
        value: 1,
        label: "Most of the rain will pour during the winter half (2)",
    },
    {
        value: null,
        label: "Not sure",
    },
]

export default function KnowYourClimates() {
    const [temp, setTemp] = useState({ low: 0, high: 1 })
    const [humidity, setHumid] = useState({ low: 0, high: 1 })
    const [windSpeed, setWind] = useState({ low: 0, high: 1 })
    const [altitude, setAlt] = useState({ low: 0, high: 1 })
    const [rainVolume, setRain] = useState({ low: 0, high: 1 })
    const [hotMonths, setHotMonths] = useState(1)
    const [scenario, setScenario] = useState(null)

    const ac = 17.62, b = 243.12;

    var tempAtHeight = (temp, altitude) => temp - (0.683 * (altitude / 100));

    var pressure = (humidity, tempAtHeight) => (humidity / 100) * 6.105 * Math.exp((17.27 * tempAtHeight) / (237.7 + tempAtHeight))

    var feelsLike = (tempAtHeight, pressure, windSpeed) => Math.round((tempAtHeight + (0.33 * pressure) - (0.7 * windSpeed) - 4), 1);

    var tempCoef = (humidity, temperature) => Math.log(humidity / 100) + ((ac * temperature) / (b + temperature));

    var dewPoint = (tempCoef) => Math.round(((b * tempCoef) / (ac - tempCoef)), 1)

    var koppenSign = KoppenDecoder(temp.low, temp.high, rainVolume.low, rainVolume.high, hotMonths, scenario)

    var tempAtHeightLow = tempAtHeight(temp.low, altitude.low), tempAtLowHigh = tempAtHeight(temp.high, altitude.high);

    const classes = useStyles()
    return (
        <Grid container component="main">
            <Grid item md={12} className={classes.header} style={{ backgroundColor: 'skyblue' }}>
                Temperatures and rainfall are monthly means therefore the timeframe for determining Koppen classification is one full year. Keep in mind though, due to the complexity of the climate classification system what you will see are 75% facts and 25% assumptions. E-mail me if you have complaints for this page.
            </Grid>
            <Grid item xs={false} sm={8} md={5}
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                className={classes.root}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Monthly average temperature {"  "} <FontAwesomeIcon icon={faThermometerFull} size="sm" /> </h3>
                    <p>{temp.low} to {temp.high} ºC</p>
                </div>
                <Range min={-40} max={50} allowCross={true} onChange={(values) => setTemp({
                    low: values[0], high: values[1]
                })} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Humidity <FontAwesomeIcon icon={faWater} size="sm" /></h3>
                    <p>{humidity.low} to {humidity.high} %</p>
                </div>
                <Range min={0} max={100} allowCross={true} onChange={(values) => setHumid({
                    low: values[0], high: values[1]
                })} />


                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
                    <h3>Wind speed <FontAwesomeIcon icon={faWind} size="sm" /></h3>
                    <p>{windSpeed.low} to {windSpeed.high} km/h</p>
                </div>
                <Range min={0} max={120} allowCross={true} onChange={(values) => setWind({
                    low: values[0], high: values[1]
                })} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Altitude <FontAwesomeIcon icon={faMountain} size="sm" /></h3>
                    <p>{altitude.low} to {altitude.high} m</p>
                </div>
                <Range min={0} max={2500} allowCross={true} onChange={(values) => setAlt({
                    low: values[0], high: values[1]
                })} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Monthly rain volume <FontAwesomeIcon icon={faCloudRain} size="sm" /></h3>
                    <p>{rainVolume.low} to {rainVolume.high} mm</p>
                </div>
                <Range min={0} max={200} allowCross={true} onChange={(values) => setRain({
                    low: values[0], high: values[1]
                })} />

                <div style={{ display: 'flex' }}>
                    <h3 style={{ flexGrow: 1 }}>Number of months averaging above 10ºC </h3>
                    <TextField
                        id="standard-select-currency"
                        select
                        label="Select"
                        value={hotMonths}
                        onChange={(e) => setHotMonths(e.target.value)}
                        style={{ flexGrow: 1 }}
                    >
                        {listOfHotMonths.map((months) => (
                            <MenuItem key={months.value} value={months.value}>
                                {months.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <h3 style={{ flexGrow: 1 }}>Choose a scenario </h3>
                    <TextField
                        id="standard-select-currency"
                        select
                        label="Select"
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        style={{ flexGrow: 1 }}
                    >
                        {listOfSeasons.map((scenario) => (
                            <MenuItem key={scenario.value} value={scenario.value}>
                                {scenario.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div style={{ backgroundColor: 'skyblue', color: 'white', fontSize: '18px', textAlign: "left", paddingLeft: 5 }}>
                    <p>(1): from April to September (if you're from South Hemisphere it's October to March)</p>
                    <p>(2): Vice versa to (1)</p>
                    <p>With 30% chance that the climate is desertic</p>
                </div>

            </Grid>
            <Grid item xs={12} sm={4} md={7} className={classes.stats}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <div>
                        <p> Feels like: {" "}
                            {feelsLike(tempAtHeightLow, pressure(humidity.low, tempAtHeightLow), windSpeed.low)} {" to "}
                            {feelsLike(tempAtLowHigh, pressure(humidity.high, tempAtLowHigh), windSpeed.high)} {" ºC "}
                        </p>
                        <p>Dew point: {" "}
                            {dewPoint(tempCoef((isNaN(humidity.low) ? 0 : humidity.low), temp.low))} {" to "}
                            {dewPoint(tempCoef((isNaN(humidity.high) ? 0 : humidity.high), temp.high))} {" ºC "}
                        </p>
                    </div>
                    <div>
                        <p>Koppen classification: {koppenSign.sign}</p>
                        <p>{koppenSign.meaning}</p>
                    </div>
                </div>
                <div style={{textAlign: 'center', height: '15vh'}}>
                    <p>{koppenSign.details}</p>
                </div>
                <div className={classes.map}>
                    {getKoppen(koppenSign.sign)}
                </div>
                <p className={{textAlign: "center"}}>
                    <p>Examples: </p>
                    {
                        koppenSign.examples.map(example => {
                            <p>{example}</p>
                        })
                    }
                </p>
                <p style={{textAlign: 'center'}}>Credits: <cite>Beck, H.E., Zimmermann, N. E., McVicar, T. R., Vergopolan, N., Berg, A., & Wood, E. F.</cite></p>
            </Grid>

        </Grid>
    )
}

function KoppenDecoder(coolestMonth, warmestMonth, maxRainfall, minRainfall, hotMonths, scenario) {
    var annualMean = (coolestMonth + warmestMonth) / 2;
    var annualRainfall = ((minRainfall + maxRainfall) / 2) * 12;

    var aridFirstCriteria = (annualRainfall < (20 * annualMean + 280)) && scenario == 1;
    var aridSecondCriteria = (annualRainfall < (20 * annualMean)) && scenario == 2;
    var aridThirdCriteria = (annualRainfall < (20 * annualMean) + 140) && scenario == null;
    var isArid = (aridFirstCriteria || aridSecondCriteria || aridThirdCriteria) && (Math.random() > 0.7);

    var majorType, secondType, thirdType;

    if (coolestMonth >= 18 && !isArid) { // tropical climates 
        majorType = "A";

        if (minRainfall >= 60) {
            secondType = "f";
        } else if (minRainfall < 60 || minRainfall >= 100 - (annualRainfall / 25)) {
            secondType = "m";
        }
        else if (minRainfall < 60 && minRainfall < 100 - (annualRainfall / 25)) {
            secondType = "w";
        }

        if (scenario == 0) secondType = 's'
        thirdType = "";
    }
    else if (isArid) { // desert and arid climates 
        majorType = "B";
        var firstCriteria = (annualRainfall < (10 * annualMean + 140)) && scenario == 0;
        var secondCriteria = (annualRainfall < (10 * annualMean)) && scenario == 1;
        var thirdCriteria = (annualRainfall < (10 * annualMean) + 70) && scenario == null;
        var anyCriteria = (firstCriteria || secondCriteria || thirdCriteria)
        if (anyCriteria) {
            secondType = "W";
        }
        else {
            secondType = "S";
        }

        if (annualMean > 18) {
            thirdType = "h";
        }
        else if (annualMean <= 18) {
            thirdType = "k";
        }
    }
    else if (warmestMonth >= 10 && !isArid) {   // temperate climates
        // first type
        if ((-3 <= coolestMonth && coolestMonth < 18)) {
            majorType = "C"
            if (minRainfall < 30) {
                secondType = "s"
            }
            else if (minRainfall < (0.1 * maxRainfall)) {
                secondType = "w"
            }
            else {
                secondType = "f";
            }
        }
        else if (coolestMonth < -3) {
            majorType = "D";
            coolestMonth < -38 ? thirdType = "d" : thirdType = ""
            if (minRainfall < 30) {
                secondType = "s"
            }
            else if (minRainfall < (0.1 * maxRainfall)) {
                secondType = "w"
            }
            else {
                secondType = "f";
            }
        }
        // second type 

        // third type 
        if (warmestMonth >= 22) thirdType = "a"
        else if (warmestMonth < 22) {
            if (hotMonths > 4) thirdType = "b"
            else thirdType = "c"
        }

    }
    else if (warmestMonth < 10 && !isArid) { // polar climates 
        majorType = "E";
        if (0 <= warmestMonth && warmestMonth <= 10) {
            secondType = "T";
        } else if (warmestMonth < 0) {
            secondType = "F";
        }
        thirdType = "";
    }

    var sign = `${majorType}${secondType}${thirdType}`
    var findKoppen = koppenReader.find(element => (element.sign === sign))

    return {
        sign,
        ...findKoppen
    }
}