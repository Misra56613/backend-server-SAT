var jwt = require('jsonwebtoken');
var semilla = require('../config/config').semilla;
// =======================================================================
// Verificar token (Middleware)
//========================================================================

exports.veriificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, semilla, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario; // Extraigo y coloco en el mismo request

        next();

        /* res.status(200).json({
            ok: true,
            decoded: decoded*/

    });
}