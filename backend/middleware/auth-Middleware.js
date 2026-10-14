// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//     try {
//         const token = req.headers.authorization;
//         if(!token){
//             return res.status(401).json({Success: false, Message: "Token is missing !"});
//         }

//         const isVerified = jwt.verify(token,process.env.JWT_SECRET_KEY);
//         req.user = isVerified;
//         next ();

//     } catch (error) {
//         return res.status(401).json({Success: false, Message: "invalid Token"});
//     }
// }

// module.exports= {authMiddleware};

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ Success: false, Message: "Token missing" });
        }
        const token = authHeader.split(" ")[1];

        const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = isVerified;

        next();
    }

    catch (error) {
        return res.status(401).json({ Success: false, Message: "Invalid token" });
    }
}

module.exports = { authMiddleware };