const { Pool, Client } = require('pg');

var dbURL = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/sot"; //Change According to Database Requirements


const pgpool = new Pool({

    connectionString: dbURL,
});

const runQuery = async (query, param) => {
    const client = await pgpool.connect()
    try {
        const res = await client.query(query, param)
        return res
    } finally {
        client.release()
    }
}

const login = async (id, pass) => {
    const user = await retrieveUser(id);
    if (user.password == pass) {
        return true
    } else {
        throw `Username or Password does not match.`
    }
}

const retrieveUser = async (id) => {
    const match = await runQuery('SELECT * FROM account WHERE id = $1', [id])
    if (match.rows.length != 0) {
        return match.rows[0]
    } else {
        throw `${id} does not exist!`
    }
}

module.exports = {
    login
}