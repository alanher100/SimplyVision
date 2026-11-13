
require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("./db");

async function createTestEditor() {
    try {
        const username = "testeditor";
        const email = "editor@simplyvision.local";
        const role = "editor";

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

        console.log("Test Editor account created!");
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await db.end();
    }
}

createTestEditor();
