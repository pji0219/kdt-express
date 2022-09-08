// @ts-check

const express = require('express');

const router = express.Router();

const POST = [
  {
    title: 'Dreaming1',
    content:
      '비틀거리고 흔들려도 난 또 한걸음을 내디뎌요 언젠가 만날 내 꿈을 향해',
  },
  {
    title: 'Dreaming2',
    content:
      '이대로 끝나는 건 아닐지 두려움이 날 자꾸만 망설이게 하지만 가슴 속 깊은 곳에서 멈추지 않는 울림이 날 앞으로 이끌죠',
  },
];

router.get('/', (req, res) => {
  if (POST) {
    const postLen = POST.length;
    res.render('board', { POST, postCounts: postLen });
  } else {
    const err = new Error('등록한 포스트가 없습니다.');
    err.statusCode = 404;
    throw.err;
  }
});

