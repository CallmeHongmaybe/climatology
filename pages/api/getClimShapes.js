const shapes = require("../../library/climateshapes.json")
const climateInfo = require("../../library/koppen.json")

export default (req, res) => {
    const {
        query: { climate }
    } = req 

    try {
        var features = shapes.filter(
            el => el.climate === climate
        ).map(el => {
            return {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: el.coords
                },
                properties: { ID: el.ID }
            }
        })

        res.status(200).json({
            geojson: {
                type: "FeatureCollection",
                features, 
            }, 
            properties: {
                color: climateInfo.find(el => el.sign == climate).color
            }
        })
        res.end()
    }
    catch (ex) {
        res.status(500).send(Error("Got an error. " + ex))
    }

}