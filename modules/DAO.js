const mysql = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1234567890',
  database: 'test',
});

const getConnection = async () => {
  return new Promise((res, rej) => {
    pool.getConnection((err, connection) => {
      if (err) {
        rej(err);
      } else {
        res(connection);
      }
    })
  });
};

module.exports = {
  getData: async () => {
    const connection = await getConnection();
    return new Promise((res, rej) => {
      const sql = `select * from user a, user_info b where a.id = b.user_id`;
      connection.query(sql, async (err, rows) => {
        if (err) {
          rej(err);
        } else {
          res(rows);
        }
        connection.release();
      });
    });
  },
  add: async () => {
    const connection = await getConnection();
    const params1 = ['zhang', '123'];
    return new Promise((res, rej) => {
      connection.beginTransaction((err) => {
        if (err) {
          rej(err);
        } else {
          connection.query(`insert into user set username = ?, password = ?`, params1, (err, result) => {
            if (err) {
              connection.rollback(() => {
                throw err;
              });
              rej(err);
            } else {
              const {
                insertId,
              } = result;
              const params2 = ['zhang', 23, 1, insertId];
              connection.query(`insert into user_info values (?, ?, ?, ?)`, params2, (err, result) => {
                if (err) {
                  connection.rollback(() => {
                    throw err;
                  });
                  rej(err);
                } else {
                  connection.commit((err) => {
                    console.log(111);
                    if (err) {
                      connection.rollback(() => {
                        throw err;
                      });
                      rej(err);
                    } else {
                      res();
                    }
                  });
                }
              });
            }
          })
        }
      })
    })
  }
};