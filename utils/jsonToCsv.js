const cities = require('cities.json')
const fs = require('fs')

const stream = fs.createWriteStream('climate/cities.csv', {flags: 'a'})

stream.write('country, name, lat, lng\n', () => console.log("wrote the labels"))

for (let i = 0; i < cities.length - 1; ++i) { 
    stream.write(`${Object.values(cities[i]).join(',')}\n`, (error) => {
        error ? console.log(err) : console.log('row ' + i + ' written')
    })
}
