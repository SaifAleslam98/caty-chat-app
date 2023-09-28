const mongoose = require('mongoose');

const dbConnection = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.BASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }).then(conn => {
        console.log(`Connected to db : ${conn.connection.name}`)
    });
}
module.exports = dbConnection;

//mongodb+srv://admin:0y5qrzadK3anF2ew@cluster0.msjjngv.mongodb.net/caty 