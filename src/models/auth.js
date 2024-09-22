const jwt = require("jsonwebtoken");
const Register = require("./registers");
const cookieParser = require('cookie-parser');

const auth = async (req, res, next) => {
    try {

        const token = req.cookies.jwt; 

        if (!token) {
            return res.redirect('/login?alert=1'); 
        }

        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await Register.findOne({ _id: verifyUser.userId });
        if (!user) {
            console.log("No user found with the provided userId:", verifyUser.userId);
            return res.redirect('/login?alert=1');  
        }
        
        req.token = token;
        req.user = user; 

        next();
        
    } catch (error) {
        console.error("Error in auth middleware:", error);

        if (error.name === 'TokenExpiredError') {
            res.clearCookie("jwt"); // Clear the expired token cookie
            return res.redirect('/home?alert=1'); 
        }

        return res.status(500).send("Internal Server Error");
    }
};

module.exports = auth;
