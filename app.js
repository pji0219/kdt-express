// @ts-check

const express = require('express');
const userRouter = require('./routes/users');

const app = express();
const PORT = 4000;

app.set('view engine', 'ejs');
app.set('views', 'views'); // views라는 폴더에서 ejs파일을 찾는다는 말

app.use('/users', userRouter);

app.use(express.static('public'));

// 이것이 모든 모듈의 에러를 처리함
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode);
  res.end(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at ${PORT}`);
});
