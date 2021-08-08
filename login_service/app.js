const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
// config imports from the config folder
const { mongoConfig, loginConfig } = require('../config/config');

// create the express app and configure all the middle ware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// define the redis client
// const redisClient = redis.createClient({
//     host: redisConfig.REDIS_HOST,
//     port: redisConfig.REDIS_PORT,
//     password: redisConfig.REDIS_PASSWORD
// });
// // configure redis as our session store
// app.use(session({
//     store: new redisStore({
//         client: redisClient,
//         ttl: loginConfig.SESSION_TTL
//     }),
//     secret: loginConfig.SESSION_SECRET,
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         httpOnly: true,
//         secure: true,
//         sameSite: true
//     }
// }));

// connect to mongoDB
var mongoDB;
const client = new MongoClient(mongoConfig.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect( (err, returnedClient) => {
    if (err) {
        console.error(err);    
    } else {
        mongoDB = returnedClient.db("stonks");
    }
});

app.use((req, res, next) => {
    console.log("HTTP request", req.method, req.url, req.body);

    // res.header('Access-Control-Allow-Headers', '*');
    // res.header('Access-Control-Allow-Origin', '*');
    next();
});


// ###########################################################################
// ---------------------------------------------------------------------------
// ##################### APPLICATION ROUTES AND LOGIC ########################
// ---------------------------------------------------------------------------
// ###########################################################################

app.post('/register', async (req, res) => {
    // get the username, email, password from body
    let { username, email, password } = req.body;
    // try catch is needed for using async await
    try {
        let user_result = await mongoDB.collection("Users").findOne({ $or: [ {username: username}, {email: email} ] });
        // check if this username or email exists already
        if (user_result !== null) {
            return res.status(409).end("username or email already exists");
        } else {
            // username is free, hash password and insert into db
            const hash = bcrypt.hashSync(password, loginConfig.SALT_ROUNDS);
            let new_user = {
                username: username,
                email: email,
                password: hash,
                createdAt: (new Date()).toUTCString(),
                privacy: null,
                bracket: [0,0],
                interests: [],
                stocks: []
            }
            let user_insert = await mongoDB.collection("Users").insertOne(new_user);
            // return the inserted count
            return res.json({insertedCount: user_insert.insertedCount});
        }
    } catch (err) {
        console.error(err);
        return res.status(500); // db operation failed 
    }
});

app.post('/login', async (req, res) => {
    // get the email and password from the body
    let { email, password } = req.body;
    // get the user document
    try {
        let user_result = await mongoDB.collection("Users").findOne({email: email});
        // check user exists
        if (user_result === null) {
            return res.status(404).end("email does not exist");
        } else {
            if (bcrypt.compareSync(password, user_result.password)) {
                // password was correct, so we create a token
                let token = jwt.sign({userID: user_result._id}, loginConfig.TOKEN_SECRET, { expiresIn: '1h' });
                return res.json({user_id: user_result._id, username: user_result.username, auth_token: token});
            } else {
                // password was wrong
                return res.status(401).end("incorrect password");
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500); // db operation failed 
    }
    
});

app.post('/verify', async (req, res) => {
    // get the token from the header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token
    
    jwt.verify(token, loginConfig.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            console.log("expired token" , token);
            return res.status(401).json({});        
        } else {
            // if (expiredTokens.includes(token)) {
            //     console.log("token was logged out", token);
            //     return res.sendStatus(401);
            // }
            console.log("valid token" , token);
            return res.status(200).json({});
        }
    });
})

app.post('/logout', async (req, res) => {
    // const authHeader = req.headers['authorization'];
    // expiredTokens.push(authHeader.split(' ')[1]);
    return res.status(200).json({});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));