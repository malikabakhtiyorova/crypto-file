const { Pool } = require('pg');

const pool = new Pool({
 	user: 'postgres',
	password: 'new',
	host: 'localhost',
	database: 'files',
	port: 5432
});

const rows = async (SQL, ...params) => {
  const client = await pool.connect()

  try {
    const { rows } = await client.query(SQL, params)
    return rows
  }
  finally {
    client.release()
  }
}

const row = async (SQL, ...params) => {
  const client = await pool.connect()

  try {
    const { rows: [row] } = await client.query(SQL, params)
    return row
  }
  finally {
    client.release()
  }
}

module.exports.rows = rows;
module.exports.row = row;