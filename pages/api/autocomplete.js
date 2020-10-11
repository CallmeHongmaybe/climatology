// const fs = require('fs')
// const data = fs.readFileSync(process.cwd() + "/library/cities.json", {flags: 'r', encoding: 'utf8'})
// const parsedData = JSON.parse(data)

import cities from 'cities.json'

export default async (req, res) => {
    res.json(cities.filter(el => Object.values(el).join(',').includes(req.query.keyword)).slice(0, 5))
    res.end()
}

// https://medium.com/@ni3t/caching-api-results-client-side-with-react-hooks-5f3070d6bdaa
// parsing time of previous approach: 398 - 450 ms 
// using createReadStream piping the JSONStream: 20 - 44 ms 