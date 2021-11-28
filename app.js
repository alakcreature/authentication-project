const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const { isAuthenticated, isNotAuthenticated } = require("./helpers");
const bcrypt = require("bcryptjs");


const {initialize} = require("./passport-config");
const passport = require("passport");
initialize(
  passport,
  email=>users.find(user=> user.email===email),
  id=> users.find(user=> user.id===id)
);


// View Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended:false }))

// To flash the messages
app.use(flash())

// Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

// Passport initialization
app.use(passport.initialize());
// It will work with the express session
app.use(passport.session());

let users = [];

// Routes
app.get('/', isAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', isNotAuthenticated,(req, res) => {
    res.render('login.ejs')
})
  
app.post('/login', isNotAuthenticated,passport.authenticate('local', {
    successRedirect: '/',   // On authentication success, it will redirect to '/'
    failureRedirect: '/login', // On authentication failue, it will redirect to '/login'
    failureFlash: true  //It will allow the passport to flash any error message if it exists
}))
  
app.get('/signup', isNotAuthenticated,(req, res) => {
    res.render('signup.ejs')
})

app.post('/signup', isNotAuthenticated,async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
        });
        res.redirect('/login');
    }
    catch(err) {
        console.log(err);
        res.redirect('/signup');
    }
})
  
  app.post('/logout', (req, res) => {
    req.logout()    // If authentication by passport succeeds, then the passport will give the function logout() to end the session for the logged in user.
    res.redirect('/login')
  })

app.listen(5000, ()=>console.log('Server started at port 5000'));
