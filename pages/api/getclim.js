const dbConnect = require('../../utils/dbConnect')
const standardSchema = require('../../models/schema')

dbConnect()

// you can sell this api for $0.01 per thousand request 

const splittedItems = item => item.replace("\s", "").split(',')

const monthQuery = (months, minTemp, maxTemp, mean) => splittedItems(months).map(month => {
    return {
        $and: [
            { [`${month}.min`]: { $gte: minTemp, $lt: mean } },
            { [`${month}.max`]: { $gt: mean, $lte: maxTemp } },
        ]
    }
})

export default async (req, res) => {
    try {
        const { query: {
            countries,
            tempRange,
            months,
            limit
        } } = req;

        var [minTemp, maxTemp] = splittedItems(tempRange)

        minTemp = parseInt(minTemp), maxTemp = parseInt(maxTemp)

        const mean = (minTemp + maxTemp) / 2

        const monthQueries = await monthQuery(months, minTemp, maxTemp, mean)

        const completeQuery = {
            $and: [
                { country: { $in: splittedItems(countries) } },
                {
                    $or: [].concat(...monthQueries)
                }
            ]
        }

        // testing 
        const foundDocs = await standardSchema.find(completeQuery).limit(200).lean().exec()

        res.status(200).json(foundDocs)
        res.end()
    }
    catch (error) {
        res.status(500).json({ message: "Something wrong happened. " + error })
    }

}

/**
 {
 "Jan.min": {
                            $and: [
                                { $gte: minTemp },
                                { $lt: mean }
                            ]
                        }
                    }

{
                        "Jan.max": {
                            $and: [
                                { $gt: mean },
                                { $lte: maxTemp },
                            ]
                        }
                    }
 */