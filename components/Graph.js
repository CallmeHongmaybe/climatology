import { LineChart, Line, XAxis, Legend, LabelList } from "recharts"
import { useState, useLayoutEffect, useContext } from 'react'
import { ACTIONS, InfoContext } from '../pages/app'
import fetchClimData from "../utils/fetchClimData"
import { UNITS, convertTemp } from './CityInfo'
import { ButtonGroup, Button } from '@material-ui/core'

export default function MonthAvgGraph({ country, name, lat, lng }) {

    const { city, dispatch } = useContext(InfoContext)

    const [data, setData] = useState({
        content: null,
        isLoading: true,
    })

    const [tempUnit, setUnit] = useState(UNITS.METRIC)

    function customLabel(props) {
        const {
            x, y, stroke, position, value,
        } = props;

        return <text x={x} y={y - 5} position={position} stroke={stroke} fontSize={12} textAnchor="middle">{convertTemp(Math.floor(value), tempUnit)}º</text>;
    }

    const fetchTheData = async () => {

        if (city.averages) {
            setData({ content: city.averages, isLoading: false })
            console.log("Cache used")
        }
        else {
            try {
                const fetchedData = await fetchClimData(country, name, lat, lng)

                setData({
                    content: fetchedData.averages,
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

    useLayoutEffect(() => {
        fetchTheData()
    }, [lat, lng])
    // func.apply is not function solved: https://stackoverflow.com/questions/63570597/typeerror-func-apply-is-not-a-function

    if (data.content) {
        return (
            <>
                <LineChart
                    width={window.screen.width * 0.42}
                    height={window.screen.height * (1/3)}
                    data={data.content}
                    margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                    style={{ top: '40%', position: 'absolute' }}
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
                        padding={{
                            left: 30,
                            right: 30
                        }}
                    />
                </LineChart>

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
            </>
        );
    }
    else {
        return <div>...Loading</div>
    }

}