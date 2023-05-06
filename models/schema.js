import { Schema, models, model } from 'mongoose'
var schema = Schema 
// const {ObjectId} = mongoose.Schema.Types
const MinMax = new schema({
    min: Number, 
    max: Number 
})

const locationSchema = new schema({
    location: {
        type: {type: String}, 
        coordinates: [] 
    }
})

const standardSchema = new schema({
    country: String,
    name: String, 
    location: locationSchema, 
    climate: String, 
    Jan: [MinMax], 
    Feb: [MinMax], 
    Mar: [MinMax], 
    Apr: [MinMax], 
    May: [MinMax], 
    Jun: [MinMax], 
    Jul: [MinMax], 
    Aug: [MinMax], 
    Sep: [MinMax], 
    Oct: [MinMax], 
    Nov: [MinMax], 
    Dec: [MinMax]
})

standardSchema.index({location: '2dsphere'})

export default models.standardSchema || model("standardSchema", standardSchema, 'new_monthly_avg')

