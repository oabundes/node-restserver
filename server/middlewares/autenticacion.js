const jwt = require('jsonwebtoken');
const Categoria = require('../models/categoria')

//
//Vrificar Token
//

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //token <- parametro en el header


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }

            });
        }

        req.usuario = decoded.usuario;
        next();


    });


};

//
//Vrificar Admin Role
//
let verificaAdminRole = (req, res, next) => {


    let role = req.usuario.role;

    if (role != 'ADMIN_ROLE') {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Se necesitan credenciales de Admnistrador'
            }

        })
    }
    next();
}

let verificaCategoria = (req, res, next) => {

    let descripcion = req.body.categoria;

    Categoria.find({ descripcion: descripcion })
        .exec((err, categoria) => {
            if (err) {

                return res.status(400).json({
                    ok: false,
                    err

                });

            }
            // console.log(categoria[0]);
            req.categoria = categoria[0];
            next();


        });
}




module.exports = {

    verificaToken,
    verificaAdminRole,
    verificaCategoria
}