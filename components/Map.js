import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, {
  NavigationControl,
  FlyToInterpolator,
  Marker,
} from 'react-map-gl';
import Head from 'next/head'
import { Typography } from '@material-ui/core'
import { InfoContext } from '../pages/app'
import LayerControls from './LayerControls'
import Pin from "../public/pin";
import SideDrawer from "./playground_menu";

const navStyle = { position: 'absolute', right: 20, top: 0, top: 10 }


function convertCoordToDegrees(coordValue) {
  var minuteVal = coordValue % 1;
  minuteVal *= 60;
  var secondVal = minuteVal % 1;
  secondVal *= 60;

  return `${Math.floor(Math.abs(coordValue))}º ${Math.floor(Math.abs(minuteVal))}' ${Math.abs(secondVal.toFixed(2))}''`
}

// thay link api này với link khác 

export default function Map() {

  const { city } = useContext(InfoContext)

  const viewState = {
    latitude: parseFloat(city.lat),
    longitude: parseFloat(city.lng),
    zoom: 9,
    transitionDuration: 2000,
    transitionInterpolator: new FlyToInterpolator()
  }

  const [viewport, setViewport] = useState(viewState);

  useEffect(() => {
    setViewport(viewState)
  }, [city.lat, city.lng]) // when you click the searchbar and this will move the map 

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
      <Head>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <ReactMapGL
        width='55vw'
        height='100vh'
        mapboxApiAccessToken={process.env.MAP_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        {...viewport}
        onViewportChange={nextViewport => setViewport({
          ...nextViewport
        })}
        style={{ position: 'relative' }}
      // onClick={handleClick}
      >
        <SideDrawer/>

        <div style={navStyle}>
          <NavigationControl/>
        </div>

        <div style={{ left: 0, bottom: 0, background: "rgba(0,0,0, 0.4)", color: 'white', padding: 2, width: '30%', wordSpacing: 1.1 }}>
          <Typography variant="body1">
            Latitude: {parseFloat(viewport.latitude) > 0 ? "N" : "S"}{convertCoordToDegrees(viewport.latitude)} <br />
            Longitude: {parseFloat(viewport.longitude) > 0 ? "E" : "W"}{convertCoordToDegrees(viewport.longitude)} <br />
          </Typography>
        </div>
        <Marker latitude={city.lat} longitude={city.lng}>
          <Pin onClick={() => setViewport(viewState)}></Pin>
        </Marker>
        <LayerControls />
      </ReactMapGL>
    </div>
  );
}

