import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
           return res.status(401).json({message: 'Unauthorized'})
        }
        const token = authHeader.split(' ')[1]
        if(!token){
            return res.status(401).json({message: 'Unauthorized'})
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
            if(err){
                return res.status(401).json({message: 'Unauthorized'})
            }
            req.user = user;
            next();
        })
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

export const verifyAdmin = (req, res, next) => {
    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({message: 'Forbidden'})
    }
    next();
}