const child_process = require('child_process')
const spawn = child_process.spawn

const lng = 106.65
const lat = 10.775
var firstProcess = spawn('python', ["./climate/getClimate.py", lng, lat])
var secondProcess = spawn('python', ["./climate/get_temperature.py", lng, lat])

let processQueue = [firstProcess, secondProcess]

processQueue.map((process, index) => {
    process.stdout.on('data', (chunk) => console.log(chunk.toString()))
    process.on('close', function (code) {
        console.log('End Child Process', index, "in", (new Date()).getMilliseconds(), "ms");
        console.log("Exit code: " + code)
    });
    // console.log(process.stdout.toString(), "in", (new Date()).getMilliseconds(), "ms")
})

