require('dotenv').config();
const express = require('express'),
      massive = require('massive'),
      cors = require('cors'),
      session = require('express-session'),
      middleware = require('./middleware/middlewareController'),
      authCtrl = require('./controllers/authController'),
      {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
      port = SERVER_PORT,
      app = express();

app.use(cors());
app.use(express.json());

app.use(session({
   resave: false,
   saveUninitialized: true,
   secret: SESSION_SECRET,
   cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}
}))

massive({
   connectionString: CONNECTION_STRING,
   ssl: {rejectUnauthorized: false}
})
.then(db => {
   app.set('db', db);
   console.log('DB connected')
   app.listen(port, () => console.log(`Server is running on Port: ${port}`));
})

//endpoints for auth
app.post('/auth/register', middleware.checkUsername, authCtrl.register);
app.post('/auth/login', middleware.checkUsername ,authCtrl.login);
app.post('/auth/logout', authCtrl.logout);
app.get('/api/user', authCtrl.getUser);