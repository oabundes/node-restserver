const express = require('express');
const Producto = require('../models/producto');
const { verificaToken, verificaCategoria } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }

                });
            }

            res.json({
                ok: true,
                producto: productoDB

            })

        });

});
//
// Obtener todos los productos
//

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {

                return res.status(500).json({
                    ok: false,
                    err

                });
            }

            res.json({
                ok: true,
                productos
            })
        })

})


app.post('/producto', [verificaToken, verificaCategoria], (req, res) => {


    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        usuario: req.usuario._id,
        categoria: req.categoria._id

    });

    producto.save((err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!productoDB) {
            return res.status(401).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            producto: productoDB

        })

    })
})


app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }

            });
        }

        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    err

                });
            };

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            })
        })




    })




})


app.put('/producto/:id', [verificaToken, verificaCategoria], (req, res) => {

    let body = req.body;
    let id = req.params.id;


    Producto.findById(id, (err, productoDB) => {


        if (err) {

            return res.status(500).json({
                ok: false,
                err

            });
        }
        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err

            });

        }


        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err

                });
            }

            res.json({

                ok: true,
                producto: productoGuardado
            })


        })




    })

});
////////////////////////////////
// Buscar productos
////////////////////////////////
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {

                return res.status(500).json({
                    ok: false,
                    err

                });
            }

            res.json({
                ok: true,
                producto
            })

        })


})


module.exports = app;