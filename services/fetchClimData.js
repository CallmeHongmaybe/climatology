export default async function fetchClimData(country, name, lat, lng) {
    const res = await fetch(`../api/getlocclim?country=${country}&name=${name}&lat=${lat}&lng=${lng}`)
    const fetchedRes = await res.json()
    return climDataTemplate(fetchedRes)
}

export function climDataTemplate(fetchedRes) {
    const [{ _id, country, name, location: { coordinates: [lng, lat] }, climate, distance, ...averages }] = fetchedRes
    
    return {
        country, name, lat, lng, climate,
        averages: (() => {
            let array = []

            for (let month in averages) {
                const { max, min } = averages[month]
                array.push({
                    name: month,
                    Low: min,
                    High: max
                })
            }
            return array
        })()
    }
}