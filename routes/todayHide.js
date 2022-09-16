const express = require('express');

const router = express.Router();

// 인덱스 페이지 접속 시 안보기 쿠키 전달
router.get('/', (req, res) => {
  res.render('index', { popup: req.cookies.popup });
});

// 하루 동안 안보기 쿠키 만들기
router.post('/cookie', (req, res) => {
  res.cookie('popup', 'hide', {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
  });
  res.send('쿠키 성공!');
});

module.exports = router;
