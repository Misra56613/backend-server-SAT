var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var semilla = require('../config/config').semilla;


var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {


        if (err) { // Manejo de errores
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear Token !!
        usuarioDB.password = ':)'; // Para no mandar la contraseña en el token
        var token = jwt.sign({ usuario: usuarioDB }, semilla, { expiresIn: 14400 }); // Expira en 4 horas
        // parametrizamos la semilla
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    })

});




module.exports = app;