// @ts-check

const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.DB_HOST;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function main() {
  await client.connect();

  const users = client.db('kdt1').collection('users');

  // await users.deleteMany({}); // 조건이 없으니 다 삭제
  // await users.insertOne({
  //   name: 'pororo',
  //   age: 5,
  // }); // 하나 추가

  /*  await users.insertMany([
    {
      name: 'pororo',
      age: 5,
    },
    {
      name: 'loopy',
      age: 6,
    },
    {
      name: 'crong',
      age: 6,
    },
  ]); */

  /* await users.deleteOne({
    name: 'crong',
  });

  await users.deleteMany({
    age: { $gte: 5 },
  }); */

  await users.updateOne(
    {
      name: 'loopy',
    },
    {
      $set: {
        name: '루피',
      },
    }
  );

  await users.updateMany(
    {
      age: { $gte: 5 },
    },
    {
      $set: {
        name: '5살 이상',
      },
    }
  );

  // const arr = await users.findOne({
  //   name: 'loopy',
  // });

  const data = users.find({}); // 조건 없이 다 찾음, {}안에는 조건
  // await data.forEach(console.log); // 몽고db에 있는 forEach
  const arr = await data.toArray();
  console.log(arr);
  await client.close();
}

main();
