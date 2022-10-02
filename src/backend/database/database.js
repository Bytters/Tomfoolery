const { Client } = require("pg")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".", "/dotenv", ".env") })

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

client.connect().then(() => {
    console.log("Conectado com sucesso a database")
})

module.exports = client
