const geoip = require('geoip-lite')
const dbConnect = require('../../utils/dbConnect')
const fetch = require('isomorphic-fetch')
const dev = process.env.NODE_ENV !== "production";
const origin = dev ? "http://localhost:3000" : "https://weather-advisor2.vercel.app";

dbConnect()

export default async (req, res) => {
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.connection.socket.remoteAddress

    var [lat, lng] = dev ? [10.775, 106.65] : (geoip.lookup(ipAddr)).ll

    const getLocation = await fetch(`${origin}/api/getNearLocs?lat=${lat}&lng=${lng}&limit=1`)
   
    res.json(await getLocation.json())
    res.end()
}
