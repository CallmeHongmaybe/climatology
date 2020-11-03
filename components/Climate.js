import { Button, Grid, Paper, Typography } from "@material-ui/core"
import { useClimateCardStyle } from './Styles'
import { useContext, useEffect, useState } from 'react'
import { ACTIONS, InfoContext } from "../pages/app";
import Koppen from '../library/koppen.json'
import fetchClimData from "../services/fetchClimData";
import numeral from 'numeral'

export default function ClimateCard() {
    const classes = useClimateCardStyle();

    const [climate, setData] = useState({
        sign: null,
        isLoading: true,
        // suggestionTree: new SuggestionTree() 
    })

    const useStyle = { display: 'flex', justifyContent: 'space-between', paddingTop: 5 }

    const { city, dispatch } = useContext(InfoContext)

    const fetcher = async () => {
        if (city.climate) {
            setData({ sign: city.climate, isLoading: false })
            console.log("Climate cache used")
        }
        else {
            try {
                const fetchedData = await fetchClimData(city.country, city.name, city.lat, city.lng)

                setData({
                    sign: fetchedData.climate,
                    isLoading: false
                })

                console.log("climate api called")

                dispatch({
                    type: ACTIONS.UPDATE_CLIMATE,
                    payload: {
                        climate: fetchedData.climate,
                        averages: fetchedData.averages
                    }
                })

            }
            catch (error) {
                throw new Error("API sucked. Reason " + error)
            }
        }
    }

    useEffect(() => {
        fetcher()
    }, [city.lat, city.lng])

    if (climate.isLoading) {
        return (
            <Grid item>
                <Typography>Loading...</Typography>
            </Grid>
        )
    }
    else {
        const getClimateData = Koppen.find(el =>
            el.sign === (new String(climate.sign || city.climate)).trim()
        )

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid xs={4} item className={classes.code}>
                            {climate.sign}
                        </Grid>
                        <Grid item xs={8} sm container>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1" color="primary">
                                    {getClimateData.meaning}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {getClimateData.details}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <div style={useStyle}>
                            <p>Coverage of earth's surface: </p>
                            <p>{getClimateData["land cover"]}%</p>
                        </div>
                        <div style={useStyle}>
                            <p>Coverage area: </p>
                            <p>approx. {numeral(getClimateData.area).format('0,0')} km<sup>2</sup> / {numeral(getClimateData.area / 2.59).format('0,0')} mi<sup>2</sup> </p>
                        </div>
                        <div style={useStyle}>
                            <p>Rank: </p>
                            <p>{numeral(getClimateData.rank).format("0o")} (out of 31)</p>
                        </div>
                        <Button
                            color="primary"
                            onClick={() => dispatch({
                                type: ACTIONS.TOGGLE_LAYER
                            })}
                        >{city.show_layer ? "Hide" : "See"} distribution of this climate</Button>
                        <Button color="primary">Find closest location that suits this climate</Button>
                    </Grid>
                </Paper>
            </div>
        );
    }
}
