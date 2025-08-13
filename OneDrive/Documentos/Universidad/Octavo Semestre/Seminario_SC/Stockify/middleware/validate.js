// middleware/validate.js
const { validationResult } = require('express-validator');

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Devuelve todos los errores de validación en un array
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = validate;
