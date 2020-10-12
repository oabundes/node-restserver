const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');

const app = express();


const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


//
//Mostrar todas las categorias
//

app.get('/categoria', (req, res) => {

    let limite = req.query.limite || 5
    limite = Number(limite);

    Categoria.find({ estado: true }, 'nombre estado')
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    err

                });
            }

            Categoria.countDocuments({ estado: true }, (err, cuenta) => {

                if (err) {

                    return res.status(400).json({
                        ok: false,
                        err

                    });
                }
                res.json({
                    ok: true,
                    categorias,
                    cuenta

                })

            });
        });




});


//
//Mostrar una categoria por ID
//
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB

        })


    })

});

//
// Crea una categoria
//

app.post('/categoria', (req, res) => {


    let body = req.body;

    let categoria = new Categoria({

        nombre: body.nombre,
        cantidad: body.nombre

    });

    categoria.save((err, categoriaDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            usuario: categoriaDB

        })

    })



});


app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'estado']);

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB

        })
    })

});


app.delete('/categoria/:id', (req, res) => {

    let body = req.body;
    let id = req.params.id;

    body.estado = false;
    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB

        })
    })

});






module.exports = app;