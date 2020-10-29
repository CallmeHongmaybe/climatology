const dbConnect = require("../../utils/dbConnect");
const standardSchema = require("../../models/schema")

dbConnect()

export default async (req, res) => {
    const { query: { lat, lng, climate, limit } } = req

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
            '$limit': parseInt(limit)
        }
    ])

    res.status(200).json(foundDocs)
    res.end()
}