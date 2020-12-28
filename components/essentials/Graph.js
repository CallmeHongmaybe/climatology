import { LineChart, Line, XAxis, Legend, LabelList } from "recharts"
import { useState, useEffect, useContext } from 'react'
import { ACTIONS, InfoContext } from '../../pages/app'
import fetchClimData from "../../services/fetchClimData"
import { UNITS, convertTemp } from './CityInfo'
import { Typography, ButtonGroup, Button, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useAccordionStyle } from "../Styles"
import numeral from 'numeral'

export default function MonthAvgGraph() {

    const { city, dispatch } = useContext(InfoContext)
    const accordionStyle = useAccordionStyle()

    const [data, setData] = useState({
        content: null,
        isLoading: true
    })
    const [tempUnit, setUnit] = useState(UNITS.METRIC)
    const [expanded, setExpanded] = useState(false)

    function customLabel(props) {
        const {
            x, y, stroke, position, value,
        } = props;

        return <text x={x} y={y - 5} position={position} stroke={stroke} fontSize={12} textAnchor="middle">{convertTemp(Math.round(value, 1), tempUnit)}º</text>;
    }

    const fetchTheData = async () => {
        setExpanded(false)
        if (city.averages) { // if the user lands on the climate tab first 
            setData({ content: city.averages, isLoading: false })
            // https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/
        }
        else {
            try {
                const fetchedData = await fetchClimData(city.country, city.name, city.lat, city.lng)
                setData({
                    content: fetchedData.averages,
                    isLoading: false
                })

                dispatch({
                    type: ACTIONS.UPDATE_CLIMATE,
                    payload: {
                        climate: fetchedData.climate,
                        averages: fetchedData.averages,
                    }
                })
            }
            catch (error) {
                throw new Error("API sucked. Reason " + error)
            }
        }
    }

    useEffect(() => {
        fetchTheData()
    }, [city.lat, city.lng])

    const findSimilarLocations = async () => {
        try {
            const locationStamp = Buffer.from(JSON.stringify({
                lat: city.lat,
                lng: city.lng,
                climate: city.climate, // use regex instead, 
                averages: city.averages
            })).toString('base64')

            const getSimilarLocations = await (await fetch(`../api/similar_temp?search=${locationStamp}`)).json()

            dispatch({
                type: ACTIONS.FIND_SIMILAR_LOCS,
                payload: getSimilarLocations
            })
        }
        catch (ex) {
            throw new Error(ex)
        }
    }

    useEffect(() => {
        if (expanded) findSimilarLocations()
        else;
    }, [expanded])

    // func.apply is not function solved: https://stackoverflow.com/questions/63570597/typeerror-func-apply-is-not-a-function

    if (data.content) {
        return (
            <div>
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

                <LineChart
                    width={window.screen.width * 0.40}
                    height={window.screen.height * (1 / 3)}
                    data={data.content}
                    margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                >
                    <Legend height={36} />
                    <Line type="monotone" dataKey="Low" dot={null} stroke="blue" strokeWidth={2}>
                        <LabelList
                            dataKey="Low"
                            position="insideTop"
                            content={customLabel}
                        />
                    </Line>
                    <Line type="monotone" dataKey="High" dot={null} stroke="red" strokeWidth={2}>
                        <LabelList
                            dataKey="High"
                            position="insideBottom"
                            content={customLabel}
                        />
                    </Line>

                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        padding={{ left: 30, right: 30 }}
                    />
                </LineChart>
                <div className={accordionStyle.root}>
                    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={accordionStyle.heading}>
                                Furthest locations with similar temperature variation
                            </Typography>
                        </AccordionSummary>

                        {
                            !city.similarLocs ? <AccordionDetails className={accordionStyle.accordionTab}>
                                <Typography classes={accordionStyle.typography}>...Loading</Typography>
                            </AccordionDetails> :
                                city.similarLocs.length ? city.similarLocs.map((item, index) =>
                                    <>
                                        <AccordionDetails className={accordionStyle.accordionTab} key={item._id} onClick={() => dispatch({
                                            type: ACTIONS.GET_CITY_INFO,
                                            payload: {
                                                ...item,
                                                lat: item.coords[1],
                                                lng: item.coords[0]
                                            }
                                        })}>
                                            <Typography className={accordionStyle.typography}>{numeral(index + 1).format('0o')}</Typography>
                                            <Typography className={accordionStyle.typography}>{item.name}, {item.country}</Typography>
                                            <Typography className={accordionStyle.typography}>{Math.floor(item.distance)} km</Typography>
                                        </AccordionDetails>
                                    </>
                                ) : <AccordionDetails className={accordionStyle.accordionTab}>
                                        <Typography className={accordionStyle.typography}>There's no other place quite like {city.name}</Typography>
                                    </AccordionDetails>
                        }
                    </Accordion>
                </div>

            </div>
        );
    }
    else {
        return <div>...Loading</div>
    }
}