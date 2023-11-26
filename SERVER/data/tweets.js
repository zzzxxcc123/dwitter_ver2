import Mongoose from 'mongoose';
import { useVirtualId } from '../db/database.js';
import * as userRepository from '../data/auth.js';
// import { db } from '../db/database.js' mysql;

const tweetSchema = new Mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    url: String,
  },
  { timestamps: true }
);

useVirtualId(tweetSchema);
const Tweet = Mongoose.model('Tweet', tweetSchema);

// mongoDB
export async function getAll() {
  return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id) {
  return Tweet.findById(id);
}

export async function create(text, userId) {
  return userRepository.findById(userId).then((user) =>
    new Tweet({
      text,
      userId,
      name: user.name,
      username: user.username,
      url: user.url,
    }).save()
  );
}

export async function update(id, text) {
  return Tweet.findByIdAndUpdate(
    id,
    { text },
    {
      returnDocument: 'after',
    }
  );
}

export async function remove(id) {
  return Tweet.findByIdAndDelete(id);
}

// mysql
// const SELECT_JOIN =
//   'SELECT tw.id, tw.text, tw.createdAt,  tw.userId, us.username, us.name, us.email, us.url from users us join tweets tw on  tw.userId = us.id';

// const ORDER_DESC = 'order by tw.createdAt DESC';

// export async function getAll() {
//   return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`).then((result) => {
//     return result[0];
//   });
// } //데이터를 가져오는 함수 생성(가져오는 동안 에러나면 안되니까 비동기로 처리)

// export async function getAllByUsername(username) {
//   return db.execute(`${SELECT_JOIN} WHERE username=?`, [username]).then((result) => {
//     return result[0];
//   });

// export async function getById(id) {
//   return db.execute(`${SELECT_JOIN} WHERE tw.id=?`, [id]).then((result) => {
//     return result[0][0];
//   });
// }

// export async function create(text, userId) {
//   const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
//   return db
//     .execute('insert into tweets(text, userId, createdAt) values(?,?,?)', [
//       text,
//       userId,
//       new Date(),
//     ])
//     .then((result) => {
//       return getById(result[0].insertId);
//     });
// }

// export async function update(id, text) {
//   return db.execute('update tweets set text = ? where id = ?', [text, id]).then((result) => {
//     return getById(id);
//   });
// }

// export async function remove(id) {
//   return db.execute('delete from tweets where id  = ?', [id]);
// }
