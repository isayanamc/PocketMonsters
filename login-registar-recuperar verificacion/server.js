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
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname));

const url = 'mongodb://localhost:27017';
const dbName = 'pocketmonters';

app.get('/duelo', async (req, res) => {
    const numeroDuelo = req.query.id;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection('duelos');

        const resultado = await collection.findOne({ "duelo": numeroDuelo });
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
            }
    
        } else {
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
                html: `<h1>Hola ${verificarEmail['nombreusuario']}</h1><span>Para cambiar tu contraseña cliquea el siguiente link:</span> <a href="http://localhost:3000/forocambiarcontrasena?email=${verificarEmail['email']}">http://localhost:3000/forocambiarcontrasena?email=${verificarEmail['email']}</a>`
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
