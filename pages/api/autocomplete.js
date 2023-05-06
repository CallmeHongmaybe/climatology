import databaseQuery, { TYPES } from "../../services/query.middleware"

export default async (req, res) => {
    try {
        const foundDocs = await databaseQuery(req, TYPES.GET_AUTO_COMPLETE)

        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.json(foundDocs)
        res.end()
    }
    catch (error) {
        res.status(500).send(error)
        res.end()
    }
}

// https://medium.com/@ni3t/caching-api-results-client-side-with-react-hooks-5f3070d6bdaa
