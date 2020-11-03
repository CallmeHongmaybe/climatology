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

const geocodeStyle = { width: 'fit-content', height: 'fit-content', position: 'absolute', zIndex: 2, right: 0, top: 0, marginRight: 2 }
const navStyle = { ...geocodeStyle, top: 36 }


function convertCoordToDegrees(coordValue) {
  var minuteVal = coordValue % 1;
  minuteVal *= 60;
  var secondVal = minuteVal % 1;
  secondVal *= 60;

  return `${Math.floor(Math.abs(coordValue))}º ${Math.floor(Math.abs(minuteVal))}' ${Math.abs(secondVal.toFixed(2))}''`
}


export async function getPlaceName(lat, lon) {
  const getPlaceName = await fetch(`http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=en&featureTypes=&location=${lon}%2C${lat}`);
  const placeName = await getPlaceName.json()
  return placeName.address ? {
    name: placeName.address.City,
    country: placeName.address.CountryCode
  } : {
      name: '',
      country: ''
    }
} // thay link api này với link khác 

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
        <div style={navStyle}>
          <NavigationControl />
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

