import jwt from 'jsonwebtoken';
export function auth(requiredRoles = []) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token não informado.' });
    try {
      const token = header.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Sem permissão para esta ação.' });
      }
      next();
    } catch {
      return res.status(401).json({ message: 'Token inválido.' });
    }
  };
}
