const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the root directory
app.use(express.static(__dirname));

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'pocketmonters';

// Route that matches everything after /duelo/
app.get('/duelo/:id', async (req, res) => {
    const numeroDuelo = req.params.id;

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Conectado al servidor MongoDB");

        const db = client.db(dbName);
        const collection = db.collection('duelos');

        const resultado = await collection.findOne({ "duelo": numeroDuelo });
        console.log("Documents retrieved:", resultado);
        await client.close();

        res.render('duelo', {resultado : resultado});
    } catch (err) {
        console.error(err);
    }
});

// anadir post para sumar turno en duelo
app.post('/duelo/calculosduelo', async (req, res) => {
    console.log(req.query);
    const numeroDuelo = req.query.id;
    try {
        // Initialize the MongoDB client without deprecated options
        const client = new MongoClient(url);
        await client.connect();
        
        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection('duelos');
        
    
        // Perform the findOneAndUpdate operation
        const result = await collection.findOneAndUpdate(
            { "duelo": numeroDuelo },
            { $inc: { 'infoduelo.turnos': 1 } }, 
            { returnDocument: 'after' }
        );

        console.log(`--------------------------${result.infoduelo.turnos}-----------------------------`);
    
        if (result) {
            res.status(200).json({ success: true });
        } 
        
        else {
            res.status(404);
        }

        // Close the MongoDB client connection
        await client.close();
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
});





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
