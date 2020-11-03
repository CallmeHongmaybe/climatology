const dbConnect = require('../../services/dbConnect')
const standardSchema = require('../../models/schema')

dbConnect()

export default async (req, res) => {
    try {
        const { query: {
            country,
            name,
            lat,
            lng
        } } = req;

        const foundDocs = await standardSchema.find(
            {
                country, name,
                "location.coordinates": [parseFloat(lng), parseFloat(lat)]
            }
        ).lean().exec()

        res.status(200).json(foundDocs)
        res.end()
    }
    catch (error) {
        res.status(500).json({ message: "Something wrong happened. " + error })
    }
}

