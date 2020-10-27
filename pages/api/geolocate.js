const geoip = require('geoip-lite')
const ip = require('request-ip')

export default (req, res) => {
    req.headers['x-forwarded-for']
    console.log(geoip.lookup(ip.getClientIp(req)))
    res.send(req.connection.remoteAddress)
    res.end()
}
