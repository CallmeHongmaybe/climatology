const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const { networkInterfaces } = require('os')

export default (req, res) => {
    const network = networkInterfaces();

    const geo = geoip.lookup(network["en0"][0].address)
    console.log(network)
    res.status(200).json({ geo })

}