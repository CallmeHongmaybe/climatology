// const fs = require('fs')
// const data = fs.readFileSync(process.cwd() + "/library/cities.json", {flags: 'r', encoding: 'utf8'})
// const parsedData = JSON.parse(data)

import dbConnect from '../../services/dbConnect'
import standardSchema from '../../models/schema'

dbConnect()

export default async (req, res) => {

    const foundDocs = await standardSchema.aggregate([{
        $search: {
            text: {
                query: req.query.keyword || " ",
                path: ["name", "country"]
            }
        }
    }, {
        $project: {
            _id: 1, 
            country: 1,
            name: 1, 
            coords: "$location.coordinates"
        }
    }, { $limit: 8 }]).exec()

    res.json(foundDocs)
    res.end()
}

// https://medium.com/@ni3t/caching-api-results-client-side-with-react-hooks-5f3070d6bdaa
