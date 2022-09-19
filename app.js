// @ts-check

const express = require('express');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('pji'));

// session
app.use(
  session({
    secret: 'pji',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

const router = require('./routes');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const passportRouter = require('./routes/passport');

passportRouter();

app.set('view engine', 'ejs');
app.set('views', 'views'); // views라는 폴더에서 ejs파일을 찾는다는 말
app.use(express.static('public'));

app.use('/', router);
app.use('/board', boardRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter.router);

app.use(express.static('public'));

// 이것이 모든 모듈의 에러를 처리함
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.end(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at ${PORT}`);
});
