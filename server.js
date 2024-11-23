const express = require('express');
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./shared/models/User');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//############### DATABASE SECTION ###############
const MONGO_URI = process.env.MONGO_URI
let mongoClient;
async function connectToDB(){
    try{
        if (!mongoClient){
            mongoClient = new MongoClient(MONGO_URI);
            await mongoClient.connect();
            console.log("Successfully connected to MongoDB");
        }
    }catch(err){
        console.log(`[connectToDB] Error: ${err}`);
        return;
    }
    return mongoClient.db('all_cards');
}

async function userExists(email){
    let user;
    try{
        const db = await connectToDB();
        const usersColl = db.collection('users');

        const query = {email: email};

        user = await usersColl.findOne(query);
        if (user == null){
            return {exists: false};
        }
    }catch(err){
        console.log(`[userExists] ERROR: ${err}`);
        return;
    }
    return {exists: true, id: user._id, email: user.email, password: user.password, country: user.country, cards: user.cards};
}

async function getUserByEmail(email){
    let user;
    try{
        const db = await connectToDB();
        const usersColl = db.collection('users');

        const query = {email: email};

        let u = await usersColl.findOne(query);
        if (u == null){
            return {user: null};
        }
        user = new User(u._id, u.email, u.password, u.country, u.cards);
    }catch(err){
        console.log(`[getUserByEmail] ERROR: ${err}`);
        return;
    }
    return {user: user.toJSON()};
}


async function createUser(email, password){
    try{
        const db = await connectToDB();
        const usersColl = db.collection('users');
        const user = {
            email: email,
            password: password,
            country: null,
            cards: null
        }
        const res = await usersColl.insertOne(user);
        console.log(`Created user ${email} with id: ${res.insertedId}`);
        return true;
    }catch(err){
        console.log(`[createUser] ERROR: ${err}`);
    }
    return false;
}
//################################################

//#################### ROUTES ####################
app.get('/', (req, res) => {
    res.send('Hello World from Node.js and MongoDB!');
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password){
        return res.status(400).send({error: "Please enter an Email and a Password to login."});
    }

    // Authenticate User
    getUserByEmail(email).then(result => {
        if (result.user == null){
            return res.status(400).send({error: `User ${email} does NOT exist. Please sign up.`});
        }
        const user = new User(result.user.id, result.user.email, result.user.password, result.user.country, result.user.cards);
        if (bcrypt.compareSync(password, user.getPassword())){
            console.log(`Logged in as ${user.getEmail()}`);
            return res.status(200).send({user: user.toJSON(frontend=true)});
        }
        return res.status(400).send({error: "Incorrect email or password."});
    });
    // userExists(email).then(result => {
    //     if (!result?.exists){
    //         return res.status(400).send({error: `User ${email} does NOT exist. Please sign up.`});
    //     }
        // if (bcrypt.compareSync(password, result.password)){
        //     console.log(`Logged in as ${email}`);
        //     return res.status(200).send({email: result.email});
        // }
    //     return res.status(400).send({error: "Incorrect email or password."});
    // });
});

app.post('/signup', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!email || !password){
        return res.status(400).send({error: "Please enter an Email and a Password to login."});
    }
    if (password != confirmPassword){
        return res.status(400).send({error: "Password and Password Confirmation do NOT match."});
    }

    const encryptedPass = bcrypt.hashSync(password, 10);

    userExists(email).then(result => {
        if (result?.exists){
            return res.status(400).send({error: `User with email ${result.email} already exists.`}); 
        }
        createUser(email, encryptedPass).then(success => {
            if (success){
                console.log(`Successully created user ${email}`);
                return res.status(200).send({email: email});
            }
            return res.status(400).send({error: "An error occured while creating the user"});
        })
    });
});
//################################################

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
