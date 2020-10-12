const express = require('express');
const Producto = require('../models/producto');
const { verificaToken, verificaCategoria } = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }

        res.json({
            ok: true,
            categoria: productoDB

        })

    });

});
//
// Obtener todos los productos
//

app.get('/producto', (req, res) => {
    let limite = req.query.limite || 5
    limite = Number(limite);

    Producto.find({ disponible: 'true' })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {

                return res.status(400).json({
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

    console.log(req.categoria);

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

            return res.status(400).json({
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

    Producto.findByIdAndRemove(id, (err, productoDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }

        if (!productoDB) {

            return res.status(402).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }

            });
        }

        res.json({
            ok: true,
            message: 'Producto Borrado'
        })


    })




})


app.put('/producto/:id', [verificaToken, verificaCategoria], (req, res) => {

    let body = _.pick(req.body, ['nombre', 'descripcion', 'categoria', 'precioUni']);
    let id = req.params.id;
    body.categoria = req.categoria._id

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {


        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });
        }
        if (!productoDB) {

            return res.status(402).json({
                ok: false,
                err

            });

        }

        res.json({
            ok: true,
            producto: productoDB
        })




    })

});




module.exports = app;