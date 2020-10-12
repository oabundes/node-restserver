const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err

            });
        }



        ////////////////////////////////////////////
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '*Usuario o contraseña incorrectos'
                }


            });
        }
        //////////////////////////////////////////

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o *contraseña incorrectos'
                }


            });

        }

        let token = jwt.sign({
            usuario: usuarioDB

        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token

        });
    });


});

// Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]}

    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true

    }

}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;
    // console.log(token);
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err,
                message: 'Token no valido ...'
            });
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err

            });
        };

        if (usuarioDB) { // El usuario "googleUser.email" si existe
            //         // Pregunta si el usuario se ha autenticado por Google
            if (usuarioDB.google === false) { // El usuario se autentica por la base de datos normal de la aplicación
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal'
                    }

                });
            } else {
                // El usuario se ha autenticado mediante su cuenta de Google
                let token = jwt.sign({ // Se obtiene un nuevo  token
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si el usuario de Google no existe en nuetsra base de datos se crea uno nuevo
            // es la primera vez que se autentica
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; //<- El password es lo que sea porque esta validado por Google y es obligatorio para crear un nuevo registro en la base de datos
            usuario.save((err, usuarioDB) => { // Se crea el usuario en la base de datos

                if (err) {

                    res.status(500).json({
                        ok: false,
                        message: "Ya valio....",
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB

                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });



        }

    });

});

module.exports = app;