const NewEntry = require('../../services/new-entry')

export default async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const entry = new NewEntry(parseFloat(lat), parseFloat(lng))
        res.send(entry.entryData)
        res.end("ok")
    }
    catch (error) {
        res.status(500).end("You have an error. " + error)
        res.end("not ok")
    }
}


// this takes 1081 ms on average to do so / without Promise that goes up to 1182 - 1200 ms 

// console.log(path.relative(__filename, "/Users/quanvihong/Desktop/weatheradvisor2/climate/getClimate.py"))

