// add yours in this instead 

module.exports = (phase, { defaultConfig }) => {
    return {
        env: {
            API_KEY: '', 
            MAP_TOKEN: '', 
            MONGO_URL: "", 
            JWT_SECRET_KEY: "", 
            coords: {}
        },  
    }
}
