let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
const PORT = 3001;

let pool = new pg.Pool({
    port: 5432,
    password: 'lhi5rgDabV14684h',
    database: 'devvarimzharim_pizzabot_dev',
    max: '10',
    host: 'postgresql.devvarimzharim.myjino.ru',
    user: 'devvarimzharim_pizzabot_dev',
});

pool.connect((err, db, done) => {
    if (err) {
        return console.log(err);
    } else {
        db.query('INSERT INTO Users ()')
    }
})

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

