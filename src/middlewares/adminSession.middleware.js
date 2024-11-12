const adminAuthMiddleware = (req, res, next) => {
  console.log("Session in middleware:", req.session);
  if (req.session&&req.session.isAdmin) {

    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

export default adminAuthMiddleware;
