const weatherData = require('../../library/ghcnm.json')
const fetch = require('isomorphic-fetch')

// // https://zellwk.com/blog/async-await-in-loops/

const getShuffledArr = arr => {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
};

async function getPlaceName(lat, lon, country) {
    const getPlaceName = await fetch(`http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=en&featureTypes=&location=${lon}%2C${lat}`);

    const placeName = await getPlaceName.json()
    return (!placeName.error ? `${placeName.address.City !== '' ? placeName.address.City + ", " : 
     ""} ${placeName.address.Region !== '' ? placeName.address.Region + ", " : ""}${country}` : country);
}

const fetchClimateData = (countries, tempRange, months, limit) => {

    const [minTemp, maxTemp] = tempRange

    return countries.map(country =>
        weatherData.filter(element =>
            element.Country === country
        )
    ).map(group => { // []
        return getShuffledArr(group).slice(0, limit).map((country) => { // [[]]
    
            const { Latitude, Longitude, Country } = country
    
            return months.map(month => {  // [[[]]]
                if (country[month] >= minTemp && country[month] <= maxTemp) {
                    return {
                        Country,
                        [month]: `${(parseFloat(country[month]) / 100).toString()}ºC`,
                        Latitude,
                        Longitude,
                    }
                }
            })
        })
    }).reduce((arr, val) =>
        arr.concat(...val), []
    ).filter(element => typeof element !== 'undefined')
}

const splittedItems = item => item.split(',')

export default async (req, res) => {
    const { query: {
        countries,
        tempRange,
        months,
        limit
    } } = req;

    const AllResults = fetchClimateData(
        splittedItems(countries),
        splittedItems(tempRange).map(variable => parseFloat(variable) * 100),
        splittedItems(months),
        parseInt(limit)
    ).map(async result => {
        const {Latitude, Longitude, Country} = result 
        const location = await getPlaceName(Latitude, Longitude, Country)
        return {
            ...result,
            location
        }
    })

    res.json(await Promise.all(AllResults))
    res.end()
}

/*
    for (const [prop, value] in Object.entries(req.query))
*/




