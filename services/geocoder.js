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