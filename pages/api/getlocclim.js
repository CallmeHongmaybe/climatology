import databaseQuery from "../../services/query.middleware"

export default async (req, res) => {
    try {
        const foundDocs = await databaseQuery(req)

        res.status(200).json(foundDocs)
        res.end()
    }
    catch (error) {
        res.status(500).json({ message: "Something wrong happened. " + error })
    }
}

