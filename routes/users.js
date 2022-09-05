// @ts-check

const express = require('express');

const router = express.Router();

const USER = [
  {
    id: 'pji',
    name: '박종익',
    email: 'pji@naver.com',
  },
  {
    id: 'test',
    name: '테스트맨',
    email: 'pji@test.com',
  },
];

router.get('/', (req, res) => {
  const userLen = USER.length;
  res.render('index', { USER, userCounts: userLen });
});

router.get('/:id', (req, res) => {
  const userData = USER.find((user) => user.id === req.params.id);
  if (userData) {
    res.send(userData);
  } else {
    const err = new Error('id not found');
    err.statusCode = 404;
    throw err;
  }
});

router.post('/', (req, res) => {
  if (req.query.id && req.query.name && req.query.email) {
    const newUser = {
      id: req.query.id,
      name: req.query.name,
      email: req.query.email,
    };
    USER.push(newUser);
    res.send('회원 등록 완료!');
  } else {
    const err = new Error('wrong query');
    err.statusCode = 500;
    throw err;
  }
});

router.put('/:id', (req, res) => {
  if (req.query.id && req.query.name && req.query.email) {
    const userData = USER.find((user) => user.id === req.params.id);
    if (userData) {
      const arrIndex = USER.findIndex((user) => user.id === req.params.id);
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER[arrIndex] = modifyUser;
      res.send('회원 수정 완료');
    } else {
      const err = new Error('id not found');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('wrong query');
    err.statusCode = 500;
    throw err;
  }
});

router.delete('/:id', (req, res) => {
  const arrIndex = USER.findIndex((user) => user.id === req.params.id);
  if (arrIndex !== -1) {
    USER.splice(arrIndex, 1);
    res.send('삭제 완료');
  } else {
    const err = new Error('id not found');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
