import cities from 'cities.json' 

export default async (req, res) => {
    res.json(cities.filter(el => el.name.includes(req.query.keyword)).slice(0, 4))
    res.end()
}
