const express = require('express');
const app = express();
require('dotenv').config()
require('./config/mongoose');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const authRoutes = require('./routes/auth')

const passport = require('passport');
require('./config/passport')(passport);

const auth = require('./middleware/authenticate')

const path = require('path')

const staticPath = path.join(__dirname, "./public");

app.use(express.static(staticPath))

app.use(cookieParser());
app.use(session({
    secret: "dndnfdf",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())

app.get("/", (req, res) => {
    if (req.user) {
        return res.redirect('/dashboard');
    }
    res.send(`<a href="http://localhost:3000/auth/google">Login With Google</a>`);
})

app.get("/dashboard", auth, (req, res) => {
    res.json({ user: req.user, logout: `http://localhost:3000/auth/logout` })
})

app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log('Running on %d', 3000)
})

