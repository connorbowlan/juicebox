const { Client } = require("pg");

const client = new Client('postgres://postgres:password@localhost:5432/juicebox');

client.connect((error) => {
     if (error) throw error;
     console.log("Connected!");
});

async function getAllUsers() {
     const { rows } = await client.query(`
               SELECT id, username FROM users
          `);

     return rows;
}

async function createUser({ username, password }) {
     try {
          const result = await client.query(`
               INSERT INTO users(username, password) 
               VALUES($1, $2) 
               ON CONFLICT (username) DO NOTHING 
               RETURNING *;
       `, [username, password]);

          return result;
     } catch (error) {
          throw error;
     }
}

module.exports = {
     client,
     getAllUsers,
     createUser
}