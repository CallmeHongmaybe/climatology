import React, { useState, useMemo } from "react";
import ReactMapGL, { GeolocateControl, FlyToInterpolator } from 'react-map-gl';
import Head from 'next/head'
import { Typography } from '@material-ui/core'

const MAP_TOKEN = "pk.eyJ1Ijoic2ltbWVyMyIsImEiOiJjang3Y2hlNGQwMGFjM3BsZ3JpM3huMWkzIn0.UHF1wCqQluK2hNoNM5d1jA"

function convertCoordToDegrees(coordValue) {
  var minuteVal = coordValue % 1;
  minuteVal *= 60;
  var secondVal = minuteVal % 1;
  secondVal *= 60;

  return `${Math.floor(Math.abs(coordValue))}º ${Math.floor(Math.abs(minuteVal))}' ${Math.abs(secondVal.toFixed(2))}''`
}

// question: How can I allow the user to move around the map while enabling them to navigate to a specific location 

export default function Map({ city }) {

  const { lat, lon } = JSON.parse(city)

  const [viewport, setViewport] = useState({
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    zoom: 9,
    transitionDuration: 3000
  });

  useMemo(() => {
    setViewport({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      zoom: 12,
      transitionDuration: 3000, 
      transitionInterpolator: new FlyToInterpolator()
    })
  }, [lat, lon])


  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh' }}>
      <Head>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <ReactMapGL
        width='60vw'
        height='100vh'
        mapboxApiAccessToken={MAP_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        {...viewport}
        onViewportChange={nextViewport => setViewport({
          ...nextViewport
        })}
        style={{ position: 'relative' }}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          label="Track your location"
          style={{ width: 'fit-content', height: 'fit-content', position: 'absolute', right: 0, padding: 2, marginRight: 1 }}
        />
        <div style={{ left: 0, bottom: 0, background: "rgba(0,0,0, 0.4)", color: 'white', padding: 2, width: '25%', wordSpacing: 1.1 }}>
          <Typography variant="body1">
            Latitude: {parseFloat(viewport.latitude) > 0 ? "N" : "S"}{convertCoordToDegrees(viewport.latitude)} <br />
            Longitude: {parseFloat(viewport.longitude) > 0 ? "E" : "W"}{convertCoordToDegrees(viewport.longitude)} <br />
          </Typography>
        </div>
      </ReactMapGL>
    </div>
  );
}

// Todo list:

// Add forecast with appropriate icons 
// Add a function that showing similar climate to the user
// Allow users to find places with similar climates 
