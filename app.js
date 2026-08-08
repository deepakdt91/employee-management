const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "employee_management",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testDatabaseConnection() {
    try {
        const connection = await db.getConnection();

        console.log("Database connected successfully");

        connection.release();
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
    }
}

// Home route
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Management</title>
        </head>

        <body>
            <h1>Welcome to Employee Management</h1>

            <p>Node.js application is running successfully.</p>

            <h2>Application Status</h2>

            <p>
                Server:
                <strong>Running</strong>
            </p>

            <p>
                Port:
                <strong>${PORT}</strong>
            </p>

            <h2>Database</h2>

            <p>
                <a href="/db-test">Test Database Connection</a>
            </p>
        </body>
        </html>
    `);
});
// Database test route
app.get("/db-test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT NOW() AS currentTime");

        res.json({
            success: true,
            message: "Database connection successful",
            data: rows
        });
    } catch (error) {
        console.error("Database query error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await testDatabaseConnection();
});
