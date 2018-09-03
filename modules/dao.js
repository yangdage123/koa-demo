const pool = require('./database');
const util = require('util');

const getConnection = async () => {
  const connection = await pool.getConnection();
  connection.query = util.promisify(connection.query);
  connection.beginTransaction = util.promisify(connection.beginTransaction);
  connection.commit = util.promisify(connection.commit);
  connection.rollback = util.promisify(connection.rollback);
  return connection;
};

module.exports = {
  getData: async () => {
    let connection;
    try {
      connection = await getConnection();
      const sql = `select * from user a, user_info b where a.id = b.user_id`;
      const rows = await connection.query(sql);
      return rows;
    } catch (e) {
      throw e;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },
  add: async () => {
    let connection;
    try {
      connection = await getConnection();
      const sql1 = `insert into user set username = ?, password = ?`;
      const params1 = ['zhang', '123'];
      await connection.beginTransaction();
      const { insertId } = await connection.query(sql1, params1);
      const sql2 = `insert into user_info values (?, ?, ?, ?)`;
      const params2 = ['zhang', 23, 1, insertId];
      await connection.query(sql2, params2);
      await connection.commit();
    } catch (e) {
      if (connection) {
        await connection.rollback();
      }
      throw e;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
};