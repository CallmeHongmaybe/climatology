const { features } = require('../c1976_2000.json')
const fs = require('fs')
var jsonfile = require('jsonfile');
const polygons = [] 

// requirements 
// the data structure is as the following: 

for (let i = 0; i < features.length; i++) {
    var shape = features[i]
    polygons.push({
        coords: shape.geometry.coordinates, 
        ID: shape.properties.ID, 
        GRIDCODE: shape.properties.GRIDCODE
    })
}

jsonfile.writeFile('climateshapes.json', polygons, { flag: 'a', encoding: 'utf-8'}, (err) => {
    console.log(err ? err : "Finsihed")
})

