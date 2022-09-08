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
    res.render('posts', { POST, postCounts: postLen });
  } else {
    const err = new Error('조회할 포스트가 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.get('/:title', (req, res) => {
  const postData = POST.find((post) => post.title === req.params.title);
  if (postData) {
    res.send(postData);
  } else {
    const err = new Error('해당 제목을 가진 포스트가 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.post('/', (req, res) => {
  if (Object.keys(req.query).length >= 1) {
    if (req.query.title && req.query.content) {
      const newPost = {
        title: req.query.title,
        content: req.query.content,
      };
      POST.push(newPost);
      res.send('포스트 등록 완료!');
      res.redirect('/posts');
    } else {
      const err = new Error('모든 입력 값을 입력해주세요.');
      err.statusCode = 400;
      throw err;
    }
  } else if (req.body) {
    if (req.body.title && req.body.content) {
      const newPost = {
        title: req.body.title,
        content: req.body.content,
      };
      POST.push(newPost);
      res.redirect('/posts');
    } else {
      const err = new Error('모든 입력 값을 입력해주세요.');
      err.statusCode = 400;
      throw err;
    }
  } else {
    const err = new Error('잘못된 쿼리 입니다.');
    err.statusCode = 400;
    throw err;
  }
});

router.put('/:title', (req, res) => {
  if (req.params.title && req.query.title && req.query.content) {
    const postData = POST.find((post) => post.title === req.params.title);
    if (postData) {
      const postIdx = POST.findIndex((post) => post.title === req.params.title);
      const modifyPost = {
        title: req.query.title,
        content: req.query.content,
      };
      POST[postIdx] = modifyPost;
      res.send('포스트 수정 완료');
      res.redirect('/posts');
    } else {
      const err = new Error('해당 포스트를 찾을 수 없습니다.');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('모든 입력 값을 입력해주세요.');
    err.statusCode = 400;
    throw err;
  }
});

router.delete('/:title', (req, res) => {
  const postIdx = POST.findIndex((post) => post.title === req.params.title);
  if (postIdx !== -1) {
    POST.splice(postIdx, 1);
    res.send('포스트 삭제 완료');
  } else {
    const err = new Error('해당 포스트를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
