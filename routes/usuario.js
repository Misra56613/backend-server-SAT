var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// =======================================================================
// Obtener todos los usuarios
//========================================================================

// Rutas
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Errorcargando usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            })
});

// =======================================================================
//Actualizar un nuevo usuario
//========================================================================

app.put('/:id', mdAutenticacion.veriificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) { // Manejo de errores
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error el susuario con el id' + id + ' no existe',
                errors: { message: 'No existe el usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) { // Manejo de errores
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});

// =======================================================================
//Crear un nuevo usuario
//========================================================================

app.post('/', mdAutenticacion.veriificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({

        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) { // Manejo de errores
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });


    });


});


// =======================================================================
//Eliminar  un usuario por el id
//========================================================================

app.delete('/:id', mdAutenticacion.veriificaToken, (req, res) => {


    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) { // Manejo de errores
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar  usuario',
                errors: err
            });
        } // Usuario Guardado
        if (!usuarioBorrado) { // Manejo de errores
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ese usuario con ese ID',
                errors: { message: 'No existe ese usuario con ese ID' }
            });
        } // Usuario Guardado    
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    })

});


module.exports = app;