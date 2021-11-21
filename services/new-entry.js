// this only works in my local folder 

const child_process = require('child_process')
const spawn = child_process.spawnSync // saves about 300 ms
const { months } = require("../services/query.middleware")

class NewEntry {

    constructor(lat, lng) {
        this.lat = lat
        this.lng = lng
        this.error = null
        this.climate = null 
        this.averages = null
    }

    get entryData() {
        this.saveData()
        return Object.assign({}, this)
    }

    spawnProcess(file) {
        return spawn('python', [file, this.lng, this.lat], {
            timeout: 5000,
            encoding: 'utf-8',
        })
    }

    getClimate() {
        try {
            this.climate = this.spawnProcess("./climate/get_climate.py").stdout
        }
        catch (exp) {
            this.error = exp
        }
    }

    getTemperatures() {
        try {
            const averages = this.spawnProcess("./climate/get_temperature.py").stdout
            this.averages = JSON.stringify(JSON.parse(averages).map((el, index) => {
                const [min, max] = el
                return {
                    [months[index]]: {
                        min, max
                    }
                }
            }))
        }
        catch (exp) {
            this.error = exp
        }
    }

    saveData() {
        if (!this.error) {
            this.getClimate()
            this.getTemperatures()
        }
        else throw new Error(this.error)
    }
}

// console.time("Entry")
// const entry = new NewEntry(37.78, -121.12)
// console.log(entry.entryData)
// console.timeEnd("Entry")

module.exports = NewEntry
