

export const userStatus = async (req, res, next) => {
const authHeader = req.headers.authorization;
if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
    
        // Check if user exists
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        next();
    
        // Check if the user is blocked
        if (user.status==='BLOCKED') {
          return res.status(403).json({ message: 'Your account has been blocked' });
        }
    }
    catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}}