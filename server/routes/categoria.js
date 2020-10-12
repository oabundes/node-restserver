const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');

const app = express();


const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


//
//Mostrar todas las categorias
//

app.get('/categoria', (req, res) => {

    let limite = req.query.limite || 20
    limite = Number(limite);

    Categoria.find({ estado: true }, 'descripcion estado usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
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

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {


    let body = req.body;

    let categoria = new Categoria({

        descripcion: body.descripcion,
        usuario: req.usuario._id //<-- Se obtiene el id por mandar "verificaToken"

    });

    categoria.save((err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {

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


app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, 'descripcion');

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, categoriaDB) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {

            return res.status(402).json({
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


app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;
    let id = req.params.id;

    body.estado = false;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }
        if (!categoriaDB) {

            return res.status(402).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }

            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'

        })
    })

});






module.exports = app;