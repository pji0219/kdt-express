// @ts-check
const express = require('express');

const router = express.Router();

const mongoClient = require('./mongo');

const login = require('./login');

// 포스트 조회
router.get('/', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const POST = await cursor.find({}).toArray();
  const postLen = POST.length;
  res.render('board', {
    POST,
    postCounts: postLen,
    // userId: req.session.userId ? req.session.userId : req.user.id,
    userId: req.session.userId
      ? req.session.userId
      : req.user?.id
      ? req.user?.id
      : req.signedCookies.user,
  });
});

// 포스트 작성 페이지로
router.get('/post/write', login.isLogin, (req, res) => {
  res.render('write');
});

// 포스트 작성
router.post('/', login.isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const newPost = {
      id: req.session.userId ? req.session.userId : req.user.id,
      userName: req.user?.name ? req.user.name : req.user?.id,
      title: req.body.title,
      content: req.body.content,
    };

    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.insertOne(newPost);
    res.redirect('/board');
  } else {
    const err = new Error('데이터가 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

// 수정할 포스트 수정 페이지로
router.get('/modifyMode/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const modifyFindPost = await cursor.findOne({ title: req.params.title });
  res.render('modify', { modifyFindPost });
});

router.post('/modify/:title', login.isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.updateOne(
      { title: req.params.title },
      { $set: { title: req.body.title, content: req.body.content } }
    );
    res.redirect('/board');
  } else {
    const err = new Error('요청 값이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.delete('/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const result = await cursor.deleteOne({ title: req.params.title });

  if (result.acknowledged) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
