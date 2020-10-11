const mongoose = require('mongoose')
// const {ObjectId} = mongoose.Schema.Types
const MinMax = new mongoose.Schema({
    min: Number, 
    max: Number 
})

const standardSchema = new mongoose.Schema({
    country: String,
    name: String, 
    lat: Number, 
    lng: Number, 
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



module.exports = mongoose.models.standardSchema || mongoose.model("standardSchema", standardSchema, 'new_monthly_avg')

