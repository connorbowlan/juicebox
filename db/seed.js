// Require our client and functions we exported from index.js.
const {
     client,
     createUser,
     getAllUsers
} = require('./index');

// A function to try to run a script to drop the table. Catch the error if there is one.
async function dropTables() {
     try {
          console.log("Starting to drop tables...");

          await client.query(`
               DROP TABLE IF EXISTS users;
          `);

          console.log("Finished dropping tables!");
     } catch (error) {
          console.error("Error dropping tables!");
          throw error;
     }
}

// A function to try to create a user table. It will throw an error if it already exists.
async function createTables() {
     try {
          console.log("Starting to build tables...");

          await client.query(`
               CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username varchar(255) UNIQUE NOT NULL,
                    password varchar(255) NOT NULL
               );
       `);

          console.log("Finished building tables!");
     } catch (error) {
          console.error("Error building tables!");
          throw error;
     }
}

// A function to try to create initial users. We're calling createUser() from index.js here.
async function createInitialUsers() {
     try {
          console.log("Starting to create users...");

          const albert = await createUser({ username: 'albert', password: 'bertie99' });

          console.log(albert);

          console.log("Finished creating users!");
     } catch (error) {
          console.error("Error creating users!");
          throw error;
     }
}

// A function to try to rebuild the database by dropping the table, creating it again, and then
// adding some new users.

// This operation is defined as 're-seeding'.
async function rebuildDB() {
     try {
          // Drop the table. It's gone!
          await dropTables();
          
          // Create the table. It's back!
          await createTables();

          // Send it some new data (users) so we have some data to work with!
          await createInitialUsers();
     } catch (error) {
          throw error;
     }
}

// A function to try to see if our connection works by running a query
// to get any and all users from the database table 'users'.
async function testDB() {
     try {
          console.log("Starting to test database...");

          const users = await getAllUsers();
          console.log("getAllUsers:", users);

          console.log("Finished database tests!");
     } catch (error) {
          console.error("Error testing database!");
          throw error;
     }
}

// Our function call for rebuildDB() so it executes.
rebuildDB()
     // Then test the database.
     .then(testDB)
     // Catch an error and send it to the console if there is one.
     .catch(console.error)
     // Conclude our connection to the client.
     .finally(() => client.end());