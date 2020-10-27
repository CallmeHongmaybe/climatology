const geoip = require('geoip-lite')
const ip = require('request-ip')

export default (req, res) => {
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.connection.socket.remoteAddress
    console.log(geoip.lookup(ipAddr))
    res.send(req.connection.remoteAddress)
    res.end()
}
