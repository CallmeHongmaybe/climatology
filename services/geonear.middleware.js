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
    ])

    return foundDocs
}