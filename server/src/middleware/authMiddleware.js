import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({
      message:
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({message: 'Forbidden'})
    }
    next();
}

export const verifyKitchen = (req, res, next) => {
    if(req.user.role !== 'KITCHEN' && req.user.role !== 'ADMIN'){
        return res.status(403).json({message: 'Forbidden'})
    }
    next();
}