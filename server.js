const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'PocketMonsters' directory
app.use('/PocketMonsters', express.static(path.join(__dirname, 'PocketMonsters')));

// Serve static files from the 'LandingGrupal' directory
app.use('/LandingGrupal', express.static(path.join(__dirname, 'LandingGrupal')));

// Serve static files from the 'login-registar-recuperar' directory
app.use('/login-registar-recuperar', express.static(path.join(__dirname, 'login-registar-recuperar')));

// Serve static files from the 'ManejoAmigos' directory
app.use('/ManejoAmigos', express.static(path.join(__dirname, 'ManejoAmigos')));

// Serve static files from the 'Perfil' directory
app.use('/Perfil', express.static(path.join(__dirname, 'Perfil')));

// Serve static files from the 'HomePage' directory
app.use(express.static(path.join(__dirname, 'HomePage')));

// Route for the homepage
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'HomePage', 'index.html'));
});

// Listen on port 8080
const PORT = 8080;
app.listen(PORT, function() {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});
