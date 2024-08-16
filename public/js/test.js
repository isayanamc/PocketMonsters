const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const path = require('path');
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ''));

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';  // Replace with your MongoDB connection string
const dbName = 'pocketmonters';

// Route that matches everything after /duel/
app.get('/duelo' , (req, res) => {
    console.log(__dirname);
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
