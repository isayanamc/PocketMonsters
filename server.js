const nodemailer = require('nodemailer');

// informacion de nodemailer
const usuarioDeEthereal = 'lacey.brakus25@ethereal.email';

const transportador = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: usuarioDeEthereal,
        pass: 'WXxaNsMAcBzmJPVmwY'
    }
});
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = 8080;
app.use(express.json()); 

app.set('view engine', 'ejs');

app.use(express.static(__dirname));

const url = 'mongodb://localhost:27017';
const dbName = 'pocketmonters';


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
app.get('/', (req, res) => {
    res.render('productLandingPage');
});

app.use('/productLandingPage', express.static(path.join(__dirname, 'productLandingPage')));

app.get('/duelo', async (req, res) => {
    const numeroDuelo = req.query.id;
    const nombreDeJugador = req.query.user;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection('duelos');
        let resultado = await collection.findOne({ "duelo": numeroDuelo });


        if (resultado['infoduelo']['jugador2']['nombreUsuario'] == nombreDeJugador){
            // cambiar aceptado a true si el que accede al link es el jugador 2
            const actualizacion = {
               $set: {
                   "infoduelo.aceptado": true 
               }
            };
           const resultadoAceptarDuelo = await collection.updateOne(resultado, actualizacion);
           resultado = await collection.findOne({ "duelo": numeroDuelo });
        }
        await client.close();

        res.render('duelo', {resultado : resultado});
    } catch (err) {
        console.error(err);
    }
});

// anadir post para sumar turno en duelo
app.post('/duelo/calculosduelo', async (req, res) => {
    const client = new MongoClient(url);
    const numeroDuelo = req.query.id;
    let turno;
    let jugador1 = req.query.jugador1;
    let jugador2 = req.query.jugador2;
    let jugadorataque1;
    let jugadorataque2;
    let checkPokemonsHp = 0;


    // ------------------------------------------ tomar numero de turno ----------------------------------

    try {
        await client.connect();
    
        const db = client.db(dbName);
        const collection = db.collection('duelos');
    
        const resultado = await collection.findOne({ "duelo": numeroDuelo });
        if (!resultado['infoduelo']['resultados']['estaterminado']){
            const turno = resultado.infoduelo.turnos;
            jugadorataque1 = resultado['infoduelo']['jugador1']['equipo'][jugador1.toString()]['ataque'];
            jugadorataque2 = resultado['infoduelo']['jugador2']['equipo'][jugador2.toString()]['ataque'];

            if (turno % 2 === 0) {
                const pokemonPath = `infoduelo.jugador2.equipo.${jugador2}.HP`;
        
                const currentHP = resultado['infoduelo']['jugador2']['equipo'][jugador2.toString()]['HP'];
                const nuevoHP = Math.max(0, currentHP - jugadorataque1);
        
                const updateResult = await collection.findOneAndUpdate(
                    { "duelo": numeroDuelo },
                    { $set: { [pokemonPath]: nuevoHP } },
                    { returnDocument: 'after' }
                );
                
                // for para revisar si todos los pokemons del jugador 2 estan en 0
                for (let i = 0; i < 6; i++){
                    if (updateResult['infoduelo']['jugador2']['equipo'][i.toString()]['HP'] <= 0){
                        checkPokemonsHp += 1; 
                    }
                }
                // verificar si checkPokemonsHp is igual a 6 
                if (checkPokemonsHp == 6){
                    // actualiza la base de datos para saber que ya hay un ganador
                    const filtro = { "duelo": numeroDuelo.toString() };
                    const actulizacion = { $set: { "infoduelo.resultados.estaterminado": true } };
                    const resultadoActualizado = await collection.updateOne(filtro, actulizacion);
                    // actualiza la base de datos para saber quien fue el ganador
                    const actulizacionGanador = { $set: { "infoduelo.resultados.ganador": resultado['infoduelo']['jugador1']['nombreUsuario']} };
                    const resultadoActualizadoGanador = await collection.updateOne(filtro, actulizacionGanador);
                    // actualiza la base de datos para saber quien fue el perdedor
                    const actulizacionPerdedor = { $set: { "infoduelo.resultados.perdedor": resultado['infoduelo']['jugador2']['nombreUsuario']} };
                    const resultadoActualizadoPerdedor = await collection.updateOne(filtro, actulizacionPerdedor);
                    //Modificar la base de datos para sumarle la victoria al jugador1 y agregar una derrota al jugador2
                    // --------------------------------------------------------------------------------------------------------------
                    const ganador = resultado['infoduelo']['jugador1']['nombreUsuario'];
                    const perdedor = resultado['infoduelo']['jugador2']['nombreUsuario'];

                    const collectionUsuarios = db.collection('usuarios');

                    const buscarGanador = await collectionUsuarios.findOne({ "nombreusuario": ganador });
            
                    const resultadoAgregarVictoria = await collectionUsuarios.updateOne(
                        { nombreusuario: ganador },
                        { $inc: { victorias: 1 } }
                    );
                    const buscarPerdedor = await collectionUsuarios.findOne({ "nombreusuario": perdedor });
            
                    const resultadoAgregarDerrota = await collectionUsuarios.updateOne(
                        { nombreusuario: perdedor },
                        { $inc: { derrotas: 1 } }
                    );
                }
        
            } 
            else {
                const pokemonPath = `infoduelo.jugador1.equipo.${jugador1}.HP`;
        
                const currentHP = resultado['infoduelo']['jugador1']['equipo'][jugador1.toString()]['HP'];
                const nuevoHP = Math.max(0, currentHP - jugadorataque2);
        
                const updateResult = await collection.findOneAndUpdate(
                    { "duelo": numeroDuelo },
                    { $set: { [pokemonPath]: nuevoHP } },
                    { returnDocument: 'after' }
                );
                // for para revisar si todos los pokemons del jugador 1 estan en 0
                for (let i = 0; i < 6; i++){
                    if (updateResult['infoduelo']['jugador1']['equipo'][i.toString()]['HP'] <= 0){
                        checkPokemonsHp += 1; 
                    }
                }
                // verificar si checkPokemonsHp is igual a 6 
                if (checkPokemonsHp == 6){
                    // actualiza la base de datos para saber que ya hay un ganador
                    const filtro = { "duelo": numeroDuelo.toString() };
                    const actulizacion = { $set: { "infoduelo.resultados.estaterminado": true } };
                    const resultadoActualizado = await collection.updateOne(filtro, actulizacion);
                    // actualiza la base de datos para saber quien fue el ganador
                    const actulizacionGanador = { $set: { "infoduelo.resultados.ganador": resultado['infoduelo']['jugador2']['nombreUsuario']} };
                    const resultadoActualizadoGanador = await collection.updateOne(filtro, actulizacionGanador);
                    // actualiza la base de datos para saber quien fue el perdedor
                    const actulizacionPerdedor = { $set: { "infoduelo.resultados.perdedor": resultado['infoduelo']['jugador1']['nombreUsuario']} };
                    const resultadoActualizadoPerdedor = await collection.updateOne(filtro, actulizacionPerdedor);
                    //Modificar la base de datos para sumarle la victoria al jugador2 y agregar una derrota al jugador1
                    // --------------------------------------------------------------------------------------------------------------
                    const ganador = resultado['infoduelo']['jugador2']['nombreUsuario'];
                    const perdedor = resultado['infoduelo']['jugador1']['nombreUsuario'];
                    
                    const collectionUsuarios = db.collection('usuarios');
                    
                    const buscarGanador = await collectionUsuarios.findOne({ "nombreusuario": ganador });
                                
                    const resultadoAgregarVictoria = await collectionUsuarios.updateOne(
                        { nombreusuario: ganador },
                        { $inc: { victorias: 1 } }
                    );
                    const buscarPerdedor = await collectionUsuarios.findOne({ "nombreusuario": perdedor });
                                
                    const resultadoAgregarDerrota = await collectionUsuarios.updateOne(
                        { nombreusuario: perdedor },
                        { $inc: { derrotas: 1 } }
                    );
                }
            }
        }
        await client.close();
    } catch (err) {
        console.error(err);
    }
    
    

    

    try {
        // Initialize the MongoDB client without deprecated options
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

        
    
        if (result) {
            res.status(200).json(result['infoduelo']);
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

app.get('/actualizardatos/duelo', async (req, res) => {
    let numeroDuelo = req.query.numeroDuelo;
    try{
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('duelos');
        const resultado = await collection.findOne({ "duelo": numeroDuelo });
        res.status(200).json(resultado['infoduelo']);
    }
    catch (error) {
        console.error(error);
    }
});


app.get('/denegarduelo', (req, res) => {
    res.render('denegarduelo');
});

app.get('/duelenoaceptado', (req, res) => {
    res.render('duelenoaceptado');
});

app.get('/ingresar', (req, res) => {
    res.render('ingresar');
});

app.get('/validaringreso', async (req, res) => {
    const email = req.query.email;
    
    const contra = req.query.contra;

    const client = new MongoClient(url);
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection('usuarios');

    const validarEmail = { "email": email };
    const resultado = await collection.findOne(validarEmail);

    //verificar si email existe
    if (resultado) {
        // si la contraseña de la base de datos es igual a la enviada
        if (resultado['contrasena'] == contra) {
            res.status(200).json({ existe: true, usuario: resultado['nombreusuario'] });
        }
        // si no es igual se envia un fasle 
        else {
            res.status(200).json({ existe: false });
        }

    } 
    // si no se encuentra el correo
    else {
        res.status(200).json({ existe: false });
    }
    await client.close();
});

app.get('/registrar', (req, res) => {
    res.render('registrar');
});

app.post('/registrarusuario', async (req, res) => {
    // informacion del nuevo usuario 
    const email = req.query.email;
    const nombreusuario = req.query.nombreusuario;
    const contra = req.query.contra;
    

    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');

        // verificar si email ya esta en uso
        const verificarEmail = await collection.findOne({ "email" : email });
        // verificar si nombre de usuario ya esta en uso
        const verificarNombreDeUsuario = await collection.findOne({ "nombreusuario" : nombreusuario });
        if (verificarEmail) {
            await client.close();
            res.status(200).json( { registrado: false, mensaje: "Correo ya esta en uso" });
        }
        else if (verificarNombreDeUsuario) {
            await client.close();
            res.status(200).json( { registrado: false, mensaje: "nombre de usuario ya esta en uso" });
        }
        else {

            // ingresa informacion de usuario nuevo
            const infoDeNuevoUsuario = {
                "email": email,
                "nombreusuario": nombreusuario,
                "victorias": 0,
                "derrotas": 0,
                "contrasena": contra, 
                "equipos": []
            };

            await collection.insertOne(infoDeNuevoUsuario);
            await client.close();
            res.status(200).json( { registrado: true, mensaje: "Usuario fue registrado correctamente" });
        }
    } 
    catch (err) {
        console.error(err);
    } 

});

app.get('/recuperarcontrasena', (req, res) => {
    res.render('recuperacionContra');

});

app.post('/cambiodecontra', async (req, res) => {
    // informacion del nuevo usuario 
    const email = req.query.email;
    

    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');

        // verificar si email ya esta en uso
        const verificarEmail = await collection.findOne({ "email" : email });
        if (verificarEmail) {
            await client.close();
            const opcionesCorreo = {
                from: usuarioDeEthereal,
                to: usuarioDeEthereal,
                subject: `cambio de contrasena de ${verificarEmail['nombreusuario']}`,
                html: `<h1>Hola ${verificarEmail['nombreusuario']}</h1><span>Para cambiar tu contraseña cliquea el siguiente link:</span> <a href="http://localhost:8080/forocambiarcontrasena?email=${verificarEmail['email']}">http://localhost:8080/forocambiarcontrasena?email=${verificarEmail['email']}</a>`
            };
            
            transportador.sendMail(opcionesCorreo, (error, info) => {
                if (error) {
                    res.status(200).json({ mensaje: error });
                    return console.log(error);
                }
            });
            res.status(200).json({ mensaje: "Si el correo electrónico ingresado está correctamente registrado, recibirás un correo electrónico para cambiar tu contraseña" });
        }
        else {
            await client.close();
            res.status(200).json({ mensaje: "Si el correo electrónico ingresado está correctamente registrado, recibirás un correo electrónico para cambiar tu contraseña" });
        }
    } 
    catch (err) {
        console.error(err);
    } 
});

app.get('/forocambiarcontrasena', (req, res) => {
    const email = {email: req.query.email};
    res.render('forocambiarcontrasena', {email: email});
});

app.post('/cambiarcontrasenabasededatos', async (req, res) => {
    const email = req.query.email;
    const contra = req.query.contra;

    try{
        const client = new MongoClient(url);
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');
        const filtro = { email: email };

        const actualizacion = {
            $set: {
                contrasena: contra 
            }
        };

        const resultado = await collection.updateOne(filtro, actualizacion);
        await client.close();
        res.status(200).json( { registrado: true, mensaje: "La contraseña fue actualizada correctamente" });
    }
    catch (err) {
        console.error(err);
        res.status(200).json( { registrado: true, mensaje: "Error al actualizar la contraseña" });
    }
});

app.get('/crearequipo', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('pokemons');
        const documents = await collection.find({}).toArray();
        await client.close();
        res.render('habilidadespokemon', {documents : documents});
    }
    catch (err){

    }
});

app.get('/datopokemon', async (req, res) => {
    const nombre = req.query.nombre;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('pokemons');
        const buscarPokemon = { "Name": nombre };
        const resultado = await collection.findOne(buscarPokemon);
        res.status(200).json(resultado);
        await client.close();
    }
    catch (err){

    }

});

// /agregar equipo a la base de datos
app.post('/agregarequipobasededatos', async (req, res) => {
    const nombre = req.query.nombre;
    let body = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');
        const buscarusuario = { "nombreusuario": nombre };

        const resultado = await collection.findOne(buscarusuario);
        if (!resultado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (resultado['equipos'].length === 0){
            body['primario'] = true;
        }
        let equipoReemplazado = false;

        resultado['equipos'] = resultado['equipos'].map(elemento => {
            if (body['nombre'].toLowerCase() === elemento['nombre'].toLowerCase()) {
                equipoReemplazado = true;
                return body; 
            }
            return elemento; 
        });

        if (!equipoReemplazado) {
            console.log('equipo nuevo');
            resultado['equipos'].push(body);
        }

        await collection.updateOne(buscarusuario, { $set: { equipos: resultado['equipos'] } });

        res.status(200).json(resultado);
        await client.close();
    } catch (err) {
        console.error('Error al procesar la solicitud:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.get('/retar', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');
        const documents = await collection.find({}).toArray();
        console.log(documents);
        await client.close();
        res.render('retar', {documents : documents});
    }
    catch (err){

    }
});

app.post('/enviarinvitacion', async (req, res) => {
    const retador = req.query.retador;
    const retado = req.query.retado;
    let retadorEquipoPrimario = false;
    let retadoEquipoPrimario = false;
    let mensajeDeError = "";
    let equipoRetador;
    let equipoRetado;
    let infoDuelo = {
        "duelo": "",
          "infoduelo": {
            "turnos": 0,
            "aceptado": false,
            "resultados": {
              "estaterminado": false,
              "ganador": "",
              "perdedor": ""
            },
            "jugador1": {
              "nombreUsuario": "",
              "equipo": {
                "0": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "1": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "2": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "3": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "4": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "5": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                }
              }
            },
            "jugador2": {
              "nombreUsuario": "",
              "equipo": {
                "0": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "1": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "2": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "3": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "4": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                },
                "5": {
                  "nombre": "",
                  "HP": 0,
                  "ataque": 0
                }
              }
            }
          }
        };
    infoDuelo['infoduelo']['jugador1']['nombreUsuario'] = retador;
    infoDuelo['infoduelo']['jugador2']['nombreUsuario'] = retado;



     const client = new MongoClient(url);
 
     try {
         await client.connect();
         const database = client.db(dbName);

        // verificar que los jugadores tienen equipo primario 
         const collectionDeUsuarios = database.collection('usuarios');
         const infoRetador = await collectionDeUsuarios.findOne({"nombreusuario":retador});
         const infoRetado = await collectionDeUsuarios.findOne({"nombreusuario":retado});

        if (infoRetador['equipos'].length === 0 || infoRetado['equipos'].length === 0){
            retadorEquipoPrimario =false;
            retadoEquipoPrimario =false;
            mensajeDeError = "Tu cuenta o la del jugador al que retaste no tiene equipos";
        }
         for (let i = 0; i < infoRetador['equipos'].length; i++) {
            if (infoRetador['equipos'][i]['primario']){
                retadorEquipoPrimario =true;
                break;
            }
         }
         for (let i = 0; i < infoRetado['equipos'].length; i++) {
            if (infoRetado['equipos'][i]['primario']){
                retadoEquipoPrimario =true;
                break;
            }
         }


        if (retadorEquipoPrimario && retadoEquipoPrimario) {
            console.log("no hay equipo");

            const collection = database.collection('duelos');
    
            const cantidadDeDuelos = await collection.find({}).toArray();
            const idDueloNuevo = cantidadDeDuelos.length.toString();
            infoDuelo['duelo'] = idDueloNuevo;

            // crear duelo en la base de datos
            const collection2 = database.collection('usuarios');
            const datosRetador = await collection2.findOne({ "nombreusuario": retador });

            // selecciona primer equipo primario retador
            for (let i = 0; i < datosRetador['equipos'].length; i++) {
                if (datosRetador['equipos'][i]['primario']){
                    console.log("primario encontrado");
                    equipoRetador = datosRetador['equipos'][i]['equipo'];
                    break;
                }
            }

            // obtener stats de cada pokemon en la base de datos en "equipoRetador"
            const collectionPokemons = database.collection('pokemons');
            for (let i = 0; i < equipoRetador.length; i++) {
                let pokemonInfo = await collectionPokemons.findOne({ "Name": equipoRetador[i] });
                infoDuelo['infoduelo']['jugador1']['equipo'][i.toString()] = {
                    "nombre": pokemonInfo['Name'],
                    "HP": pokemonInfo['HP'],
                    "ataque": pokemonInfo['Attack']
                }
            }

            // selecciona primer equipo primario retado
            const datosRetado = await collection2.findOne({ "nombreusuario": retado});
            for (let i = 0; i < datosRetado['equipos'].length; i++) {
                if (datosRetado['equipos'][i]['primario']){
                    console.log("primario encontrado");
                    equipoRetado = datosRetado['equipos'][i]['equipo'];
                    break;
                }
            }

            // obtener stats de cada pokemon en la base de datos en "equipoRetado"
            for (let i = 0; i < equipoRetado.length; i++) {
                let pokemonInfo = await collectionPokemons.findOne({ "Name": equipoRetado[i] });
                infoDuelo['infoduelo']['jugador2']['equipo'][i.toString()] = {
                    "nombre": pokemonInfo['Name'],
                    "HP": pokemonInfo['HP'],
                    "ataque": pokemonInfo['Attack']
                }
            }
            console.log('----------------- duelo final -------------------');
            for (let i = 0; i < 6; i++) {
                console.log(infoDuelo['infoduelo']['jugador1']['equipo'][i]);

            }

            for (let i = 0; i < 6; i++) {
                console.log(infoDuelo['infoduelo']['jugador2']['equipo'][i]);
            }

            const resulto = await collection.insertOne(infoDuelo);

            
            await client.close();

            // enviar invitacion a retado
            const opcionesCorreo = {
                from: usuarioDeEthereal,
                to: usuarioDeEthereal,
                subject: `${retador} te ha retado a un duelo`,
                html: `<h1>Hola ${retado}</h1><span>${retador} te ha retado a un duelo. Para aceptar el duelo cliquea el siguiente link:</span> <a href="http://localhost:8080/duelo?id=${idDueloNuevo}&user=${retado}">http://localhost:8080/duelo?id=${idDueloNuevo}&user=${retado}</a>`
            };
                
            transportador.sendMail(opcionesCorreo, (error, info) => {
                if (error) {
                    res.status(200).json({ mensaje: error });
                    return console.log(error);
                }
            });

            // enviar invitacion a retador
            const opcionesCorreo2 = {
                from: usuarioDeEthereal,
                to: usuarioDeEthereal,
                subject: `Has retado a un duelo a ${retado}`,
                html: `<h1>Hola ${retador}</h1><span>Has retado a un duelo a ${retado}. Cuando ${retado} acepte el duelo podras empezar el duelo cliqueando el siguiente link:</span> <a href="http://localhost:8080/duelo?id=${idDueloNuevo}&user=${retador}">http://localhost:8080/duelo?id=${idDueloNuevo}&user=${retador}</a>`
            };
                
            transportador.sendMail(opcionesCorreo2, (error, info) => {
                if (error) {
                    res.status(200).json({ mensaje: error });
                    return console.log(error);
                }
            });
            res.status(200).json({ mensaje: "Usuario retado correctamente" });
        }
        else {
            await client.close();
            if (mensajeDeError == ""){
                mensajeDeError = "Tu cuenta o la del jugador al que retaste no tiene equipo primario."
            }
            res.status(200).json({ mensaje: mensajeDeError });
        }
         
     } 
     catch (err) {
         console.error(err);
     } 
});

app.get('/estadisticas', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');
        const documents = await collection.find({}).toArray();
        console.log(documents);
        await client.close();
        res.render('estadisticas', {documents : documents});
    }
    catch (err){

    }
});

app.get('/misequipos', (req, res) => {
    res.render('equipoprimario');
});

app.get('/userinfo', async (req, res) => {
    const usuario = req.query.usuario;
    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');
        const documents = await collection.findOne({'nombreusuario':usuario});
        console.log(documents);
        await client.close();
        res.status(200).json(documents);
    }
    catch (err){

    }
});

app.post('/seleccionarequipoprimario', async (req, res) => {
    const equiposeleccionado = req.query.equiposeleccionado;
    const usuario = req.query.usuario;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('usuarios');

        // Busca el usuario
        const documents = await collection.findOne({ 'nombreusuario': usuario });

        // Pone todos los equipos en false primero
        await collection.updateOne(
            { nombreusuario: usuario },
            { $set: { "equipos.$[].primario": false } }
        );

        // Pone el equipo seleccionado como primario 
        await collection.updateOne(
            { nombreusuario: usuario, "equipos.nombre": equiposeleccionado },
            { $set: { "equipos.$.primario": true } }
        );

        await client.close();
        res.status(200).json({ mensaje:"Equipo seleccionado correctamente"});

    } catch (err) {
        console.error(err);
        await client.close();
        res.status(500).json({ message: 'Error al seleccionar equipo' });
    }
});

//Serve static files from the 'product' directory
app.get('/product', (req, res) => {
    res.render('product');
});

// Serve static files from the 'LandingGrupal' directory
app.get('/landingGroup', (req, res) => {
    res.render('landingGroup');
});




app.listen(PORT, function() {
    console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});
