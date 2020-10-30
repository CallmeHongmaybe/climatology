const dbConnect = require("../utils/dbConnect");
const standardSchema = require("../models/schema")

dbConnect()

// this middleware is to get nearby places that matches the query 

export async function geoNearMiddleware(lat, lng, req) {
    const { query: { climate, limit } } = req

    const queryClimate = climate ? {
        'query': {
            climate: climate
        }
    } : {}

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
                'maxDistance': 5 * 10e3,
                'spherical': true,
                ...queryClimate
            }
        }, {
            '$limit': parseInt(limit) || 1 
        },
    ])

    return foundDocs
}