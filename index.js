require('dotenv').config()


console.log(process.env.MAIL_USER, 'HELLO HELLO')

const express = require('express');
const path = require('path');
const cors = require('cors');
const { t, html } = require('./src/config');
const { log } = require('console');
require('./utils/node-mailer');
const app = express();
const session = require('express-session');
app.use(express.json());
app.use(cors());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));
app.set('view engine', 'ejs');
const userRoutes = require('./routes/auth-routes');
app.use('/', userRoutes)
app.set('json spaces', 2);

// app.get('/', (req, res) => {
//   res.send(html(t.greet));
// });

const startServer = () => {
  const port = process.env.PORT || 4000;
  app.listen(port, () => log(`Server ran away!\nhttp://localhost:${port}`));
};

startServer();
