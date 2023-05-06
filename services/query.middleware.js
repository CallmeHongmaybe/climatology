import dbConnect from './dbConnect'
import standardSchema from '../models/schema'

dbConnect()

export const TYPES = {
    GET_FAR_AWAY_SIMILAR_TEMP: "GET_FAR_AWAY_SIMILAR_TEMP",
    GET_LOC_CLIMATE: "GET_LOC_CLIMATE",
    GET_RANDOM_LOC: "GET_RANDOM_LOC",
    GET_NEAREST_LOCS: "GET_NEAREST_LOCS", 
    GET_AUTO_COMPLETE: "GET_AUTO_COMPLETE"
}

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


export default async function databaseQuery(req, type = TYPES.GET_LOC_CLIMATE) {
    switch (type) {
        case TYPES.GET_LOC_CLIMATE:

            const { query: {
                country, name, lat, lng
            } } = req;

            return await standardSchema.find(
                {
                    country, name,
                    "location.coordinates": [parseFloat(lng), parseFloat(lat)]
                }
            ).lean().exec()

        case TYPES.GET_FAR_AWAY_SIMILAR_TEMP:

            const getQueriedLoc = JSON.parse(Buffer.from(req.query.search, 'base64'))

            var result = {}

            for (let i = 0; i < getQueriedLoc.averages.length - 1; i++) {

                const monthData = getQueriedLoc.averages[i]
                const whichMonth = monthData.name
                // 20% difference
                result[`${whichMonth}.min`] = { $gt: monthData.Low - 3 }
                result[`${whichMonth}.max`] = { $lt: monthData.High + 3 }
            }

            return await standardSchema.aggregate([
                {
                    '$geoNear': {
                        'near': {
                            'type': 'Point',
                            'coordinates': [
                                parseFloat(getQueriedLoc.lng), parseFloat(getQueriedLoc.lat)
                            ]
                        },
                        'distanceField': 'distance',
                        'distanceMultiplier': 1 / 1000,
                        'query': {
                            ...result,
                            climate: getQueriedLoc.climate // use regex instead
                        }
                    },
                },
                { "$sort": { "distance": -1 } }
            ]).project({
                country: 1,
                name: 1,
                distance: 1,
                coords: "$location.coordinates"
            }).limit(2)

        case TYPES.GET_RANDOM_LOC:
            return await standardSchema.aggregate([
                { $sample: { size: 1 } }
            ]);
        case TYPES.GET_AUTO_COMPLETE: 
            const keyword = req.query.keyword || "";
            const regex = new RegExp(keyword, "i"); // "i" for case-insensitive search
            
            const foundDocs = await standardSchema.find({
                $or: [
                    { name: { $regex: regex } },
                    { country: { $regex: regex } },
                ]})
                .select("_id country name location.coordinates")
                .limit(5)
                .exec();

            return foundDocs 
        default:
            return;
    }
}

/*
{"lng":121.53185,"lat":25.04776,"averages":{"Jan":{"min":13.34,"max":18.17},"Feb":{"min":12.72,"max":18.73},"Mar":{"min":15.83,"max":23.23},"Apr":{"min":18.78,"max":26.01},"May":{"min":22.94,"max":29.97},"Jun":{"min":24.1,"max":30.71},"Jul":{"min":25.28,"max":32.32},"Aug":{"min":25.11,"max":32.02},"Sep":{"min":24.48,"max":30.88},"Oct":{"min":20.02,"max":25.86},"Nov":{"min":18.85,"max":23.68},"Dec":{"min":15.82,"max":20.52}}}
*/