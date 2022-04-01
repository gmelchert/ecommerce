async function connect() {
    if (global.connection && global.connection.state !== 'disconnected') return global.connection

    const mysql = require('mysql2')
    try {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'ecommerce'
        })
        global.connect = connection
        return connection
    } catch (err) {
        throw err
    }
}

function select(sql) {
    return new Promise(async (resolve, reject) => {
        const conn = await connect()
        conn.query(sql, (err, res) => {
            conn.end()
            if (err) reject(err)
            resolve(res)
        })
    })
}

function exec(sql, values = []) {
    return new Promise(async (resolve, reject) => {
        const conn = await connect()
        conn.query(sql, values, (err, res) => {
            conn.end()
            if (err) reject(err)
            if (!res) reject("Nada encontrado")
            resolve(res)
        })
    })
}

module.exports = { select, exec }