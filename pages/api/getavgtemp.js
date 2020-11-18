import databaseQuery, { TYPES } from '../../services/query.middleware'
// you can sell this api for $0.01 per thousand request 

export default async (req, res) => {
    try {
        const foundDocs = await databaseQuery(req, TYPES.GET_AVG_TEMP)
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