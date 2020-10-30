const geoip = require('geoip-lite')
const dbConnect = require('../../utils/dbConnect')
const dev = process.env.NODE_ENV !== "production"
const { geoNearMiddleware } = require('../../middlewares/geonear.middleware')

dbConnect()

async function handler(req, res) {
    try {
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.connection.socket.remoteAddress

        let geolookup = geoip.lookup(ipAddr)
        var [lat, lng] = (dev) ? [10.775, 106.65] : (geolookup ? geolookup.ll : [,])

        const getLocation = await geoNearMiddleware(lat, lng, req)

        res.send(getLocation)
        res.end('ok')
    }
    catch (error) {
        res.status(500).send(error)
        res.end('not ok')
    }
}

export default handler
