const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const authMiddleware = async (req, res, next) => {
    try {
      const token = req.cookies.token;
        if(token){
            jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
                if(err){
                    return res.status(401).json({Message:"UnAuthorised User"});
                }
                const user = await User.findById(decoded.id);
                if(!user){
                    return res.status(404).json({Message:"User not found"});
                }
                // console.log(user);
                req.user = user;
                next();
            })
        }
        else {
            return res.status(401).json({ Error: "Token not provided" });
          }

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = authMiddleware;