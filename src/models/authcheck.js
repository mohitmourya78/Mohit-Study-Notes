
const authCheck = (req, res, next) => {
    
    const token = req.cookies.jwt;
    res.locals.isLoggedIn = !!token;  // true if token exists, false if not
    next();
};


module.exports = authCheck ;