module.exports = (phase, { defaultConfig }) => {
    return {
        env: {
            API_KEY: '&APPID=90b69e04f771dd97292642ad7fbc1744', 
            MAP_TOKEN: 'pk.eyJ1Ijoic2ltbWVyMyIsImEiOiJjang3Y2hlNGQwMGFjM3BsZ3JpM3huMWkzIn0.UHF1wCqQluK2hNoNM5d1jA', 
            MONGO_URL: "mongodb+srv://Dennis:GzZxz8JAzjq9wO8s@weatheradvisor-aen4i.mongodb.net/ghcnm", 
            JWT_SECRET_KEY: "b5462f86-c16a-4ca5-bd5a-c91bcad0e073", 
            coords: {
                mylat: 10.775, mylon: 106.65
            }
        },  
    }
}
