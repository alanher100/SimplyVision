
require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("./db");

async function createTestUser() {
    try {
        const username = "testmanager";
        const email = "manager@simplyvision.local";
        const role = "manager";

        const password = process.env.TEST_USER_PASSWORD;

        if (!password) {
            throw new Error(
                "Set TEST_USER_PASSWORD in your .env file"
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await db.execute(
            `INSERT INTO users
             (username, email, password_hash, role)
             VALUES (?, ?, ?, ?)`,
            [username, email, passwordHash, role]
        );

        console.log("Test Manager account created!");
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await db.end();
    }
}

createTestUser();
