const mongoose = require('mongoose');

module.exports = function dbConnect() {
    const db = mongoose.connection;

    if (db.readyState !== 1) {
        mongoose.connect(
            process.env.MONGO_URL || "mongodb://localhost:27017/ghcnm",
            {
                useNewUrlParser: true,
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
    else;
}