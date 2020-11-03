export default async function fetchClimData(country, name, lat, lng) {
    const res = await fetch(`../api/getlocclim?country=${country}&name=${name}&lat=${lat}&lng=${lng}`)
    const fetchedRes = await res.json()
    const [{ climate, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec }] = fetchedRes
    return {
        climate,
        averages: [
            { name: "Jan", Low: Jan.min, High: Jan.max },
            { name: "Feb", Low: Feb.min, High: Feb.max },
            { name: "Mar", Low: Mar.min, High: Mar.max },
            { name: "Apr", Low: Apr.min, High: Apr.max },
            { name: "May", Low: May.min, High: May.max },
            { name: "Jun", Low: Jun.min, High: Jun.max },
            { name: "Jul", Low: Jul.min, High: Jul.max },
            { name: "Aug", Low: Aug.min, High: Aug.max },
            { name: "Sep", Low: Sep.min, High: Sep.max },
            { name: "Oct", Low: Oct.min, High: Oct.max },
            { name: "Nov", Low: Nov.min, High: Nov.max },
            { name: "Dec", Low: Dec.min, High: Dec.max }
        ]
    }
}