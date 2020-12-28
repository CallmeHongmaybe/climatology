const geoip = require('geoip-lite')
const req_ip = require('request-ip')
const { geoNearMiddleware } = require('../../services/geonear.middleware')
const dev = process.env.NODE_ENV !== "production"

function getCoordFromIP(req) {   
    let ipAddr = req.headers['x-forwarded-for'] || req_ip.getClientIp(req) || req.connection.remoteAddress || req.connection.socket.remoteAddress 

    let geolookup = geoip.lookup(ipAddr)
    var [lat, lng] = (dev) ? [process.env.mylat, process.env.mylon] : geolookup.ll // error is here 

    return [lat, lng]
}

async function geolocator(req, res) {
    try {
        if (!req.query.lat || !req.query.lng) {
            var getLocation = await geoNearMiddleware(...getCoordFromIP(req), req)

            res.send(getLocation)
        }
        else {
            const {lat, lng} = req.query 
            res.send(await geoNearMiddleware(lat, lng, req))
        }
        res.end('ok')
    }
    catch (error) {
        res.status(500).json({
            message: "There's an error: " + error
        })
        res.end()
    }
}

export default geolocator
