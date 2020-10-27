import { useContext, useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";
import { ACTIONS, InfoContext } from "../pages/app";
import { useControlPanelStyle } from './Styles'
import { Button, Switch, FormGroup, FormControlLabel } from "@material-ui/core";

export default function LayerControls() {

    const { city, dispatch } = useContext(InfoContext)
    const defaultState = { showClimate: true, showPlaces: false };
    const controlPanelStyle = useControlPanelStyle()

    const [settings, setSettings] = useState({
        layerData: null,
        placeData: null,
        ...defaultState
    })

    const handleChange = (evt) => {
        setSettings({ ...settings, [evt.target.name]: evt.target.checked });
        // put all the code here
    };

    // hook for getting geoJSON of the climate 
    useEffect(() => {
        if (!city.show_layer) return;
        else {
            fetch(`../api/getClimShapes?climate=${city.climate}`)
                .then(res => res.json())
                .then(res => {
                    setSettings({ ...settings, layerData: res })
                })
            console.log("Climate shape api called")
        }
    }, [city.show_layer])

    // closing event for control panel

    useEffect(() => {
        const { showClimate, showPlaces } = settings;

        if (!showClimate && !showPlaces) {
            // this will execute no matter what happens after the condition is met 
            let action = setTimeout(() => {
                setSettings({ ...defaultState });
                dispatch({
                    type: ACTIONS.TOGGLE_LAYER
                })
            }, 5000);

            return () => clearTimeout(action);

        }
    }, [settings.showClimate, settings.showPlaces])


    // hook for getting cities belonging to a certain climate 
    // useEffect(() => {
    //     fetchCitiesBelongingTo(climate)
    // }, [settings.placeData])

    if (city.show_layer && settings.layerData) {
        return (
            <>
                {
                    settings.showClimate
                        ? <Source id="dataSource" type="geojson" data={settings.layerData.geojson}>
                            <Layer id="data" type="fill" source="datasource" paint={{
                                "fill-color": settings.layerData.properties.color,
                                "fill-opacity": 0.7
                            }}></Layer>
                        </Source>
                        : null
                }

                <div
                    style={controlPanelStyle}
                >
                    <FormGroup column={true}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.showClimate}
                                    onChange={handleChange}
                                    name="showClimate"
                                />
                            }
                            label="Climate layer"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.showPlaces}
                                    onChange={handleChange}
                                    name="showPlaces"
                                    color="primary"
                                />
                            }
                            label="Cluster"
                        />
                    </FormGroup>
                    <Button
                        onClick={() => setSettings({
                            ...settings,
                            showClimate: false,
                            showPlaces: false
                        })
                    }
                    >
                        Clear all layers
                  </Button>
            </div>
            </>
        )
    }
    else return <></>;




}