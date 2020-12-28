const mongoose = require('mongoose');

module.exports = function dbConnect() {
    const db = mongoose.connection;

    if (db.readyState !== 1) {
        mongoose.connect(
            process.env.MONGO_URL || 
            "mongodb://localhost:27017/ghcnm?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

        db.on('error', () => {
            db.close()
        });

        // db.on('open', () => {
        //     console.log("connected to db " + db.name);
        // });
    }
    else;
}