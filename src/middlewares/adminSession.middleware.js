const adminAuthMiddleware = (req, res, next) => {
  if (req.session&&req.session.isAdmin) {
     next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

export default adminAuthMiddleware;
