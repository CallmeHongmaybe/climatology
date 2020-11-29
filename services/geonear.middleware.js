const dbConnect = require("./dbConnect");
const standardSchema = require("../models/schema")

dbConnect()

// this middleware is to get nearby places that matches the query 

export async function geoNearMiddleware(lat, lng, req) {
    const { query: { climate, limit } } = req

    // if the api query is left blank then geolocation is inferred
    const queryClimate = climate ? {
        'query': { climate }
    } : {
            'maxDistance': 5 * 1000
        }

    const foundDocs = await standardSchema.aggregate([
        {
            '$geoNear': {
                'near': {
                    'type': 'Point',
                    'coordinates': [
                        parseFloat(lng), parseFloat(lat)
                    ]
                },
                'distanceField': 'distance',
                'spherical': true,
                'distanceMultiplier': 1 / 1000,
                ...queryClimate
            }
        }, {
            '$limit': parseInt(limit) || 1
        },
    ]).project(climate ? {
        distance: 1,
        location: 1,
        country: 1,
        name: 1,
        _id: 1
    } : {
            _id: 1,
            country: 1,
            name: 1,
            location: 1,
            climate: 1,
            Jan: 1, Feb: 1, Mar: 1, Apr: 1, May: 1, Jun: 1, Jul: 1, Aug: 1, Sep: 1, Oct: 1, Nov: 1, Dec: 1
        })

    return foundDocs
}