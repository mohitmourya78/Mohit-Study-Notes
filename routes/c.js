
const express = require('express');
const router = express.Router();
const auth = require("../src/models/auth")
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());


router.get("/", (req, res) => {
    res.render("notes/C-notes/C", { isLoggedIn: res.locals.isLoggedIn });
});

router.get('/syntax-of-c', (req, res) => {
    res.render("notes/C-notes/Syntaxofc", { isLoggedIn: res.locals.isLoggedIn });
});

router.get('/comments-in-c', (req, res) => {
    res.render("notes/C-notes/Commentsinc", { isLoggedIn: res.locals.isLoggedIn });
});

router.get('/variables-in-c', (req, res) => {
    res.render("notes/C-notes/Variablesinc", { isLoggedIn: res.locals.isLoggedIn });
});

module.exports = router;
