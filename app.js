// @ts-check

const express = require('express');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoClient = require('./routes/mongo');

const app = express();
const PORT = 4000;

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

passport.use(
  new LocalStrategy(
    {
      usernameField: 'id',
      passwordField: 'password',
    },
    async (id, password, cb) => {
      const client = await mongoClient.connect();
      const userCursor = client.db('kdt1').collection('users');
      const idResult = await userCursor.findOne({ id });
      if (idResult !== null) {
        const result = await userCursor.findOne({
          id,
          password,
        });
        if (result !== null) {
          cb(null, result);
        } else {
          cb(null, false, { message: '비밀번호가 다릅니다.' });
        }
      } else {
        cb(null, false, { message: '해당 id 가 없습니다.' });
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('users');
  const result = await userCursor.findOne({ id });
  if (result) cb(null, result);
});

const router = require('./routes');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const client = require('./routes/mongo');

app.set('view engine', 'ejs');
app.set('views', 'views'); // views라는 폴더에서 ejs파일을 찾는다는 말

app.use('/', router);
app.use('/board', boardRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

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
