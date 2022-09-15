// @ts-check

const express = require('express');
const mongoClient = require('./mongo');
// const { MongoClient, ServerApiVersion } = require('mongodb');

const router = express.Router();

router.get('/', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const POST = await cursor.find({}).toArray();
  const postLen = POST.length;
  res.render('board', { POST, postCounts: postLen });
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
router.get('/post/write', (req, res) => {
  res.render('write');
});

// 글 작성
router.post('/', async (req, res) => {
  if (req.body.title && req.body.content) {
    const newPost = {
      title: req.body.title,
      content: req.body.content,
    };

    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.insertOne(newPost);
    res.redirect('/board');
  } else {
    const err = new Error('모든 값을 입력해 주세요.');
    err.statusCode = 400;
    throw err;
  }
});

// 수정 모드 진입 시 해당 글 불러오는 라우터
router.get('/modifyMode/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  await cursor.findOne({ title: req.params.title }, (err, result) => {
    if (err) {
      throw err;
    } else {
      const modifyFindPost = result;
      res.render('modify', { modifyFindPost });
    }
  });
});

// 글 수정
router.post('/modify/:title', async (req, res) => {
  if (req.body.title && req.body.content) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.updateOne(
      { title: req.params.title },
      { $set: { title: req.body.title, content: req.body.content } }
    );
    res.redirect('/board');
  } else {
    const err = new Error('해당 포스트가 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.delete('/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  cursor.deleteOne({ title: req.params.title }, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send('삭제 완료');
    }
  });
});

module.exports = router;
