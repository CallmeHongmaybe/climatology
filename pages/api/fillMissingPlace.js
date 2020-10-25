const child_process = require('child_process')
const spawn = child_process.spawnSync

export default async (req, res) => {

    return new Promise(resolve => {
        try {
            const { lat, lng } = req.query;
            const python = spawn('python', ['climate/getClimate.py', lng, lat])
            const output = python.stdout
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.write(output.toString())
            res.end()
        }
        catch (error) {
            res.status(500).end("You have an error. " + error)
            return resolve()
        }
        return resolve()
    })

}


// this takes 1081 ms on average to do so / without Promise that goes up to 1182 - 1200 ms 

// console.log(path.relative(__filename, "/Users/quanvihong/Desktop/weatheradvisor2/climate/getClimate.py"))

