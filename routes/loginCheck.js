const bcrypt = require('bcrypt');
const saltRounds = 7

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
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
        return user
    } else {
        throw `ID or Password does not match.`
    }
}

const retrieveUser = async (id) => {
    const match = await runQuery('SELECT * FROM account WHERE id = $1', [id])
    if (match.rows.length != 0) {
        return match.rows[0]
    } else {
        throw `No account with ID: ${id} `
    }
}

const addStudent = async (username, password) => {
    console.log(username)
    return await runQuery('INSERT INTO account (id, password, type) VALUES ($1, $2, $3)', [username, password, "Student"])
}

const usernameAvailable = async (aID) => {
    const match = await runQuery('SELECT * FROM account WHERE id = $1', [aID])
    if (match.rows.length === 0) {
        return true
    } else {
        return false
    }
}

const signup = async (aID, password, passwordConfirm) => {
    const ava = await usernameAvailable(aID)

    if (aID.length < 9 || aID.length > 9) { 
        throw `Username must be 9 characters`
    } else if (!ava) { 
        throw `${aID} already in use.`
    } else if (password != passwordConfirm) {
        throw `Passwords do not match.`
    } else {
        let hashed = await makeHash(password)
        addStudent(aID, hashed)
        return `${aID} added`
    }
}

const makeHash = async (password) => {
    const hashPass = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) reject(err)
            resolve(hash)
        })
    })
    return hashPass
}

module.exports = {
    login,
    signup
}