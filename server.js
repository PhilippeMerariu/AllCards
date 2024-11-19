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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
connectToDB();
