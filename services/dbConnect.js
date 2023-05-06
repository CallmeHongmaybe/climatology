import { connection, connect } from 'mongoose';

export default function dbConnect() {
    const db = connection;

    if (db.readyState !== 1) {
        connect(
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