const fs = require('fs');
const csv = require('fast-csv');

const json = []

const float = parseFloat
 
fs.createReadStream('/Users/quanvihong/Desktop/weatheradvisor2/climate/world_climate.csv')
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        const {country,name,lat,lng,climate,Jan_min,Feb_min,Mar_min,Apr_min,May_min,Jun_min,Jul_min,Aug_min,Sep_min,Oct_min,Nov_min,Dec_min,Jan_max,Feb_max,Mar_max,Apr_max,May_max,Jun_max,Jul_max,Aug_max,Sep_max,Oct_max,Nov_max,Dec_max} = row; 

        json.push({
            country, name, lat, lng, climate, 
            Jan: {
                min: float(Jan_min), 
                max: float(Jan_max) 
            },
            Feb: {
                min: float(Feb_min), 
                max: float(Feb_max) 
            },
            Mar: {
                min: float(Mar_min), 
                max: float(Mar_max) 
            },
            Apr: {
                min: float(Apr_min), 
                max: float(Apr_max) 
            },
            May: {
                min: float(May_min), 
                max: float(May_max) 
            },
            Jun: {
                min: float(Jun_min), 
                max: float(Jun_max) 
            },
            Jul: {
                min: float(Jul_min), 
                max: float(Jul_max) 
            },
            Aug: {
                min: float(Aug_min), 
                max: float(Aug_max) 
            },
            Sep: {
                min: float(Sep_min), 
                max: float(Sep_max) 
            },
            Oct: {
                min: float(Oct_min), 
                max: float(Oct_max) 
            },
            Nov: {
                min: float(Nov_min), 
                max: float(Nov_max) 
            },
            Dec: {
                min: float(Dec_min), 
                max: float(Dec_max) 
            }
        })
        console.log("Row finished.")
    })
    .on('end', () => {
        fs.writeFile("./untitled.json", JSON.stringify(json), (err) => console.log(err ? err : "Finished"))
    });