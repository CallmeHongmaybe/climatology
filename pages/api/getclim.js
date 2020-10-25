const dbConnect = require('../../utils/dbConnect')
const standardSchema = require('../../models/schema')

dbConnect()

// you can sell this api for $0.01 per thousand request 
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const splittedItems = item => item.replace("\s", "").split(',')

export default async (req, res) => {
    try {
        const { query: {
            tempRange
        } } = req;

        const getCurrentMonth = months[(new Date()).getMonth()]

        var [minTemp, maxTemp] = splittedItems(tempRange)

        minTemp = parseInt(minTemp), maxTemp = parseInt(maxTemp)

        const foundDocs = await standardSchema.aggregate([
            {
                $match: {
                    [`${getCurrentMonth}.min`]: { $gte: minTemp },
                    [`${getCurrentMonth}.max`]: { $lte: maxTemp }
                }
            }, 
            { $sample: { size: 5 } }
        ])

        // testing 
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