const express = require('express');
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//############### DATABASE SECTION ###############
MONGO_URI = process.env.MONGO_URI
let mongoClient;
async function connectToDB(){
    try{
        if (!mongoClient){
            mongoClient = new MongoClient(MONGO_URI);
            await mongoClient.connect();
            console.log("Successfully connected to MongoDB");
        }
    }catch(err){
        console.log("Error:", err);
        return
    }
    return mongoClient.db('all_cards');
}

async function userExists(email){
    try{
        const db = await connectToDB();
        const usersColl = db.collection('users');

        const query = {email: email};

        const user = await usersColl.findOne(query);
        if (user == null){
            return false;
        }
    }catch(err){
        console.log(err);
    }
    return true;
}

async function createUser(email, password){
    try{
        const db = await connectToDB();
        const usersColl = db.collection('users');
        const user = {
            email: email,
            password: password,
            country: null
        }
        const res = await usersColl.insertOne(user);
        console.log(`Created user ${email} with id: ${res.insertedId}`);
        return true;
    }catch(err){
        console.log(err);
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!email || !password){
        return res.status(400).send({error: "Please enter an Email and a Password to login."});
    }
    return res.status(200).send({email: email});
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

    encryptedPass = bcrypt.hashSync(password, 10);

    userExists(email).then(yes => {
        if (yes){
            return res.status(400).send({error: `User with email ${email} already exists.`}); 
        }
        createUser(email, encryptedPass).then(success => {
            if (success){
                return res.status(200).send({email: email});
            }
            return res.status(400).send({error: "An error occured while creating the user"});
        })
    });
});
//################################################

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
