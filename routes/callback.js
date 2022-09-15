// get
MongoClient.connect(uri, (err, db) => {
  const data = db.db('kdt1').collection('board');

  data.find({}).toArray((err, result) => {
    const POST = result;
    const postLen = POST.length;
    res.render('board', { POST, postCounts: postLen });
  });
});

// 수정 진입
MongoClient.connect(uri, (err, db) => {
  const data = db.db('kdt1').collection('board');

  data.findOne({ title: req.params.title }, (err, result) => {
    if (err) {
      throw err;
    } else {
      const modifyFindPost = result;
      res.render('modify', { modifyFindPost });
    }
  });
});

// 수정
MongoClient.connect(uri, (err, db) => {
  const data = db.db('kdt1').collection('board');

  data.updateOne(
    { title: req.params.title },
    { $set: { title: req.body.title, content: req.body.content } },
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.redirect('/board');
      }
    }
  );
});

// 삭제
MongoClient.connect(uri, (err, db) => {
  const data = db.db('kdt1').collection('board');

  data.deleteOne({ title: req.params.title }, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send('삭제 완료');
    }
  });
});
