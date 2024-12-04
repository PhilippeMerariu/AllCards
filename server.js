const express = require('express');
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./shared/models/User');
const Card = require('./shared/models/Card');

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
            country: "",
            cards: []
        }
        const res = await usersColl.insertOne(user);
        console.log(`Created user ${email} with id: ${res.insertedId}`);
        return true;
    }catch(err){
        console.log(`[createUser] ERROR: ${err}`);
    }
    return false;
}

async function getCardsByEmail(email){
    try{
        const db = await connectToDB();
        const coll = db.collection('users');
        const query = {email: email};

        const user = await coll.findOne(query);
        if (user == null){
            throw Error("Unable to find user");
        }

        return {cards: user.cards};
    }catch(err){
        console.log(`[getCardsByEmail] ERROR: ${err}`);
    }
    return {cards: null};
}

async function getUserCard(cardName, email){
    try{
        const db = await connectToDB();
        const coll = db.collection('users');
        const query = {email: email, "cards.store": cardName}

        const user = await coll.findOne(query);
        if (user == null){
            throw Error("Unable to find user");
        }

        let card = null;
        user.cards.forEach((v) => {
            if (v.store == cardName){
                card = new Card(v.store, v.barcode, v.color, v.logo);
            }
        });
        if (card == null){
            throw Error("Unable to find card");
        }
        return {card: card.toJSON()};
    }catch(err){
        console.log(`[getUserCard] ERROR: ${err}`);
    }
    return {card: null};
}

async function createCard(card, user){
    try{
        const db = await connectToDB();
        const coll = db.collection('users');
        const query = {email: user.email};

        let updated = false;
        const cardsRes = await getCardsByEmail(user.email);
        cardsRes.cards.forEach((v, k) => {
            if (v.store == card.store){
                cardsRes.cards[k] = card.toJSON();
                updated = true;
            }
        });

        if (!updated){
            cardsRes.cards.push(card.toJSON());
        }

        await coll.updateOne(query, {$set: {"cards": cardsRes.cards}});
        return true;
    }catch(err){
        console.log(`[createCard] ERROR: ${err}`);
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

    // Check if user exists before creating
    getUserByEmail(email).then(result => {
        if (result.user != null){
            return res.status(400).send({error: `User with email ${email} already exists.`}); 
        }
        createUser(email, encryptedPass).then(success => {
            if (success){
                console.log(`Successully created user ${email}`);
                return res.status(200).send({email: email});
            }
            return res.status(400).send({error: "An error occured while creating the user"});
        });
    });
});

app.post('/getcards', (req, res) => {
    const email = req.body.email;

    getCardsByEmail(email).then(result => {
        if (result.cards == null){
            return res.status(400).send({error: `Unable to get cards`});
        }
        return res.status(200).send({cards: result.cards});
    });
});

app.post('/getcard', (req, res) => {
    const email = req.body.email;
    const cardName = req.body.card;

    getUserCard(cardName, email).then(result => {
        if (result.card == null){
            return res.status(400).send({error: `Unable to get card`});
        }
        return res.status(200).send({card: result.card});
    })
});

app.post('/addcard', (req, res) => {
    const store = req.body.store;
    const barcode = req.body.barcode;
    const color = req.body.color;
    const logo = req.body.logo;
    const user = req.body.user;

    const card = new Card(store, barcode, color, logo);

    createCard(card, user).then(success => {
        if (success){
            console.log(`Successfully created/updated card ${store} for ${user.email}`);
            return res.status(200).send({card: card.toJSON()});
        }
        return res.status(400).send({error: "An error occured while creating the card"});
    });

});
//################################################

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));