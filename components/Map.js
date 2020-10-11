import React, { useState, useEffect } from "react";
import ReactMapGL, {
  GeolocateControl,
  NavigationControl,
  FlyToInterpolator
} from 'react-map-gl';
import Head from 'next/head'
import { Typography } from '@material-ui/core'
import { ACTIONS } from '../pages/app'

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
}

// question: How can I allow the user to move around the map while enabling them to navigate to a specific location 

export default function Map({ lat, lng, dispatch }) {

  const viewState = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
    zoom: 9,
    transitionDuration: 3000,
    transitionInterpolator: new FlyToInterpolator()
  }

  const [viewport, setViewport] = useState(viewState);

  useEffect(() => {
    setViewport(viewState)
  }, [lat, lng]) // when you click the searchbar and this will move the map 

  // handleClick = (e) => {
  //     if (e.button == 3 || e.which == 2) console.log()
  // }
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
        <div style={geocodeStyle}>
          <GeolocateControl
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            onViewStateChange={async viewport => {
              const { latitude, longitude } = viewport.viewState
              const placeNameRes = await getPlaceName(latitude, longitude)
              const { name, country } = placeNameRes
              dispatch({ // replace dispatch with router.push( sth as sth ) 
                type: ACTIONS.GET_CITY_INFO,
                payload: {
                  country,
                  name,
                  lat: parseFloat(latitude),
                  lng: parseFloat(longitude),
                }
              })
            }
            }
          />
        </div>
        <div style={navStyle}>
          <NavigationControl />
        </div>
        <div style={{ left: 0, bottom: 0, background: "rgba(0,0,0, 0.4)", color: 'white', padding: 2, width: '30%', wordSpacing: 1.1 }}>
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
