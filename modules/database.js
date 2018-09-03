/**
 * connect mysql
 * 将query转化成Promise函数
 */
const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1234567890',
  database: 'test',
});

pool.getConnection((err, connection) => {
  if (err) {
    throw new Error('mysql connect error');
  }
  if (connection) {
    connection.release();
  }
  return;
});

pool.query = util.promisify(pool.query);
pool.getConnection = util.promisify(pool.getConnection);

module.exports = pool;
