require("dotenv").config()
const express = require("express")
const cNotes = require('../routes/c')
const bcrypt = require("bcrypt")
const authCheck = require("./models/authcheck")
const service = require("./models/services")
const cookieParser = require('cookie-parser');
const Cookies = require('cookies')
const auth = require("./models/auth")
const favicon = require('serve-favicon');
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session');
const flash = require('connect-flash');
const { check, validationResult, cookie } = require('express-validator');
const path = require("path") 
const hbs = require("hbs")
require("./db/conn")
const Register = require("./models/registers")
const Contact = require("./models/contact")
const port = 3000
const static_path = path.join(__dirname, "../public")
const templates_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")


app.use('/c-notes', cNotes)
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(static_path))
app.use(authCheck)
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 } 
}));
app.use(flash());
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.set("view engine", "hbs")
app.set("views", templates_path)
hbs.registerPartials(partials_path)



/*app.get("/", (req, res) => {
    res.render("home")

})*/

app.get("/", async (req , res) => {

    try {
        const services = await service.find(); // Fetching data from the Service model
        if (!services.length) {
            return res.status(400).json({ msg: "No services found" });
        }
        res.render("home", { services });
        services.forEach(service => {
        }); 
        
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }

})

app.get("/register", (req, res) => {
    res.render("registration")

})
app.get("/login", (req, res) => {
    res.render("login")

})


app.get("/logout", auth, async (req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter((elem) => {
            /* if(!elem.token)
                 return req.token*/
            return elem.token !== req.token
        })

        // for clear the all cokkies...
        // res.user.tokens =[]

        res.clearCookie("jwt")

        await req.user.save()

        res.redirect("/")

        console.log("logout succesfull")

    } catch (error) {

        res.status(500).send(error)
    }

})

app.get("/contactt", auth, (req, res) => {
    res.render("contact")

})
app.get("/about", auth, (req, res) => {
    try {
        const user = req.user;
        res.render('about', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


app.get('/home', authCheck, async (req, res) => {

    try {
        const services = await service.find(); // Fetching data from the Service model
        if (!services.length) {
            return res.status(400).json({ msg: "No services found" });
        }
        res.render('home', { services ,  isLoggedIn: res.locals.isLoggedIn});
        services.forEach(service => {
        }); 
        
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }

    
});

app.get("*", (req, res) => {
    res.render("errorpage")

})


app.post("/register", [
    check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be up to 3 charactors'),
    check('email').isEmail().withMessage('Invalid Email Address'),
    check('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("Validation Errors:", errors.array());


        res.render('registration', { errors: errors.mapped() });
    }
    else {


        try {
            /*console.log(req.body.name);
            console.log(req.body.email);
            console.log(req.body.password);*/

            //const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const userRegister = new Register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            const duplicateEmail = await Register.findOne({ email: req.body.email });
            if (duplicateEmail) {
                // Display alert box
                res.send("<script>alert('Email already exists. Please choose a different email.'); window.location.href='/register';</script>");
            } else {
                await userRegister.save()
               // const token = await userRegister.generateToken();

             //res.cookie("jwt", token, { httpOnly: true }); 

                //console.log("Generated Token:", token);

                console.log("registration successfull")
                
                // res.status(201).render("login", { token });
                res.redirect("login");
            }

        } catch (error) {
            res.status(400).send(error);
        }

    }
});

app.post("/login", [
    check('email').isEmail().withMessage('Invalid Email address'),
    check('password').notEmpty().withMessage('Password Invalid').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("Validation Errors:", errors.array());

        res.render('login', { errors: errors.mapped() });
    }
    else {

        try {
            /*console.log(req.body.email);
            console.log(req.body.password);*/

            const email = req.body.email
            const password = req.body.password

            const useremail = await Register.findOne({ email })

            if (!useremail) {
                return res.render('registration', { alertMessage: 'User not found. Please register.' });
            }


            const hashedPassword = await bcrypt.compare(password, useremail.password);


            if (hashedPassword) {

                const token = await useremail.generateToken();

                res.cookie("jwt", token, { httpOnly: true, secure: false, sameSite: 'lax' });
                console.log("JWT cookie set:", token);


                console.log("login sucessfull")

                //res.render("home", { token }) not try this other you faced the refresh problem... 
                res.redirect("home")

            }
            else {
                return res.render('login', { passwordInvalid: true });
            }

        } catch (error) {
            res.status(400).send(error);
        }
    }

})

app.post("/contact", [
    check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be up to 3 charactors'),
    check('phone').notEmpty().withMessage('Phone Number Is Required').isLength({ min: 10 }).withMessage('Invalid Phone Number'),
    check('email').isEmail().withMessage('Invalid Email Address'),
    check('text').notEmpty().withMessage('Text field is Required')

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("Validation Errors:", errors.array());

        res.render('contact', { errors: errors.mapped() });
    }
    else {


        try {
            console.log(req.body.name);
            console.log(req.body.email);
            console.log(req.body.phone);
            console.log(req.body.text);

            const userContact = new Contact({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                text: req.body.text
            });

            await userContact.save();
            console.log("details send secessfully..")
            res.redirect("contactt");
        } catch (error) {
            res.status(400).send(error);
        }
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
