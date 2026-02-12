require('dotenv').config();
const express = require('express');
require('express-async-errors');
const favicon = require('serve-favicon');
const app = express();
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
app.use(favicon(path.join(__dirname, 'favicon.ico')));
const checkAuthorization = require('./middlewares/authorization');
const getAllUsers = require('./middlewares/getallusers')
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const PORT = 3000;
const VIEWS_PATH = path.join(__dirname,'/views');

app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials','.mustache'));
app.set('views',VIEWS_PATH);
app.set('view engine','mustache');
app.use('/css',express.static('css'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
        // secure: true, // Uncomment this line to enforce HTTPS protocol.
        sameSite: true
    }
}));

app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next) => {
    res.locals.authenticated = req.session.user == null ? false : true
    next()
});
// set up a middleware for routes
app.use('/',indexRoutes);
app.use('/users',checkAuthorization,userRoutes);
// app.use('/users',getAllUsers,userRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { message: 'Something went wrong' });
});

app.listen(PORT,() => {
    console.log(`Server has started on ${PORT}`)
});