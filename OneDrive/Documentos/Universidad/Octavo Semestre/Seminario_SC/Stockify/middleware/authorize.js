// middleware/authorize.js
/**
 * authorize([...allowedRoles])
 * Ejemplo: authorize(['administracion','almacen'])
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const { rol } = req.user; 
    if (!allowedRoles.includes(rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
}

module.exports = { authorize };
