const express = require('express');
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
MONGO_URI = process.env.MONGO_URI
async function connectToDB(){
    try{
        const mongoClient = new MongoClient(MONGO_URI);
        await mongoClient.connect();
        console.log("Successfully connected to MongoDB");
    }catch(err){
        console.log("Error:", err);
    }
}

app.get('/', (req, res) => {
    res.send('Hello World from Node.js and MongoDB!');
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!email || !password){
        return res.status(400).send({error: "Please enter an Email and a Password to login."});
    }
    return res.status(200).send({email: email});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
// connectToDB();
