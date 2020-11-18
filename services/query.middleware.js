const dbConnect = require('./dbConnect')
const standardSchema = require('../models/schema')

dbConnect()

export const TYPES = {
    GET_AVG_TEMP: "GET_AVG_TEMP",
    GET_LOC_CLIMATE: "GET_LOC_CLIMATE", 
    GET_RANDOM_LOC: "GET_RANDOM_LOC"
}

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const splittedItems = item => item.replace("\s", "").split(',')

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

        case TYPES.GET_AVG_TEMP:

            const { query: { tempRange, month } } = req;

            var [minTemp, maxTemp] = splittedItems(tempRange).map(el => parseInt(el))
            const getCurrentMonth = month || months[(new Date()).getMonth()]

            return await standardSchema.aggregate([
                {
                    $match: {
                        [`${getCurrentMonth}.min`]: { $gte: minTemp },
                        [`${getCurrentMonth}.max`]: { $lte: maxTemp }
                    }
                },
                { $sample: { size: 5 } }
            ]).project({
                country: 1,
                name: 1,
                climate: 1,
                location: {
                    coordinates: 1
                },
                [getCurrentMonth]: 1
            })
        case GET_RANDOM_LOC: 
            return; 
        default:
            return;
    }
}