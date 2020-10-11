const mongoose = require('mongoose'); 

module.exports = function dbConnect() { 
    const db = mongoose.connection;

    if (db.readyState !== 1) {    
        mongoose.connect(
            "mongodb://localhost:27017/ghcnm" || process.env.MONGO_URL,
            {useNewUrlParser: true, 
            useUnifiedTopology: true 
        });

        db.on('error', () => {
            console.log("Damn")
            db.close()
        }); 

        db.on('open', () => {
            console.log("connected to db " + db.name); 
        });
    }
}