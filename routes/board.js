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
    throw err;
  }
});

router.get('/:title', (req, res) => {
  const postData = POST.find((post) => post.title === req.params.title);
  if (postData) {
    res.send(postData);
  } else {
    const err = new Error('해당 포스트가 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

// 글 작성 모드 진입 시 글 작성 폼 불러오는 라우터
router.get('/write', (req, res) => {
  res.render('write');
});

// 글 작성
router.post('/', (req, res) => {
  if (req.body.title && req.body.content) {
    const newPost = {
      title: req.body.title,
      content: req.body.content,
    };
    POST.push(newPost);
    res.sendStatus(201);
    res.redirect('/board');
  } else {
    const err = new Error('모든 값을 입력해 주세요.');
    err.statusCode = 400;
    throw err;
  }
});

// 수정 모드 진입 시 해당 글 불러오는 라우터
router.get('/modifyMode/:title', (req, res) => {
  const postData = POST.find((post) => post.title === req.params.title);
  if (postData) {
    const postIdx = POST.findIndex((post) => post.title === req.params.title);
    const modifyFindPost = POST[postIdx];
    res.render('modify', { modifyFindPost });
  } else {
    const err = new Error('해당 포스트가 존재하지 않습니다.');
    err.statusCode = 404;
    throw err;
  }
});

// 글 수정
router.post('/modify/:title', (req, res) => {
  const postData = POST.find((post) => post.title === req.params.title);
  if (postData) {
    const modifyPost = {
      title: req.body.title,
      content: req.body.content,
    };
    const postIdx = POST.findIndex((post) => post.title === req.body.title);
    POST[postIdx] = modifyPost;
    res.redirect('/board');
  } else {
    const err = new Error('해당 포스트가 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.delete('/:title', (req, res) => {
  const postIdx = POST.findIndex((post) => post.title === req.body.title);
  if (postIdx !== -1) {
    POST.splice(postIdx, 1);
    res.sendStatus(204);
  } else {
    const err = new Error('해당 포스트를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
