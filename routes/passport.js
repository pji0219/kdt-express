const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
require('dotenv').config();

const mongoClient = require('./mongo');

module.exports = () => {
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
          if (idResult.password === password) {
            cb(null, idResult);
          } else {
            cb(null, false, { message: '비밀번호가 틀렸습니다.' });
          }
        } else {
          cb(null, false, { message: '해당 id가 없습니다' });
        }
      }
    )
  );

  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: process.env.NAVER_CB_URL,
      },
      async (accessToken, refreshToken, profile, cb) => {
        // console.log(profile);
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id: profile.id });
        if (result !== null) {
          cb(null, result);
        } else {
          // console.log(profile.displayName);
          const newNaverUser = {
            id: profile.id,
            name:
              profile.displayName !== undefined
                ? profile.displayName
                : profile.emails[0]?.value,
            provider: profile.provider,
          };
          const dbResult = await userCursor.insertOne(newNaverUser);
          if (dbResult.acknowledged) {
            cb(null, newNaverUser);
          } else {
            cb(null, false, { message: '네이버 회원 생성 에러' });
          }
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser(async (id, cb) => {
    cb(null, user);
    // const client = await mongoClient.connect();
    // const userCursor = client.db('kdt1').collection('users');
    // const result = await userCursor.findOne({ id });
    // if (result !== null) cb(null, result);
  });
};
