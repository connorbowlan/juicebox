// Require PostGres package from node_modules.
const { Client } = require("pg");

// My connection string (the value passed to Client() below) is different than yours. Ignore this.
const client = new Client('postgres://postgres:password@localhost:5432/juicebox');

// Attempt to connect to the client (AKA the database server, AKA Postgres)
client.connect((error) => {
     if (error) throw error;
     console.log("Connected!");
});

// A function that returns an object "rows" containing Id and Username from 'users'.
async function getAllUsers() {
     const { rows } = await client.query(`
               SELECT id, username FROM users
          `);

     return rows;
}

// A function that creates a user from the object passed
// containing arguments 'username' and 'password'.
// If there is any conflict in creating the user, do nothing.
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

// Export our client and our 2 functions from above.
module.exports = {
     client,
     getAllUsers,
     createUser
}