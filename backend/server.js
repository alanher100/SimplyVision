// Sprint 3 Backend Authentication

require("dotenv").config();

const express = require("express");
const session = require("express-session");

const path = require("path");

const MySQLStore = require("express-mysql-session")(session);
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
app.use(express.json());

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing");
}

const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    createDatabaseTable: false,
    schema: {
        tableName: "sessions"
    }
});

app.use(session({
    name: "simplyvision.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

// Sprint 3
// SV-203: Serve SimplyVision frontend
const projectRoot = path.join(__dirname, "..");

// Public login page
app.get("/frontend/login.html", (req, res) => {
    res.sendFile(path.join(projectRoot, "frontend", "login.html"));
});

// Public login authentication pages and assets
app.use("/frontend", (req, res, next) => {
    if (req.path === "/login.html" ||
        req.path === "/login.js" ||
        req.path === "/login.css" ||
        req.path === "/forgot-password.html" ||
        req.path === "/assets/simplyvision-logo.png" ||
        req.path === "/assets/basketball-banner.jpg") {
        return next();
    }

// Sprint 4: SV-208: Restrict Editor Review to Manager and Editor
if (req.path === "/editor-review" ||
    req.path.startsWith("/editor-review/")) {
    return requireRole("manager", "editor")(req, res, next);
}

// Sprint 4 SV-213: Protect alternate Candidate Clips URL
if (req.path === "/candidate-clips" ||
    req.path.startsWith("/candidate-clips/")) {
    return requireRole("manager", "editor")(req, res, next);
}

// Sprint 4 SV-213: Restrict remaining frontend pages
return requireRole("manager", "editor")(req, res, next);


}, express.static(
    path.join(projectRoot, "frontend")
));

//  Redirect homepage to login
app.get("/", (req, res) => {
    res.redirect("/frontend/login.html");
});

// Shared image assets for authenticated pages: fixing image error
app.use("/assets", requireAuth, express.static(
    path.join(projectRoot, "frontend", "assets")
));

// SV-203: Protect dashboard from unauthenticated users
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/frontend/login.html");
    }

    next();
}

// Sprint 4: SV-208: Role-Based Access Control
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect("/frontend/login.html");
        }

        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send(
                "Access denied: You do not have permission to view this page."
            );
        }

        next();
    };
}

// Sprint 4 SV-213: Dashboard access for Manager and Editor
app.use("/dashboard", requireRole("manager", "editor"), express.static(
    path.join(projectRoot, "dashboard")
));

 // Sprint 3 SV-203: Serve additional protected SimplyVision pages

// Sprint 4 SV-213: Upload Footage access for Manager and Editor
app.use("/upload-footage-review", requireRole("manager", "editor"), express.static(
    path.join(projectRoot, "upload-footage-review")
));
// Sprint 4 SV-213: Candidate Clips access for Manager and Editor
app.use("/candidate-clips", requireRole("manager", "editor"), express.static(
    path.join(projectRoot, "frontend", "candidate-clips")
));
// Sprint 4: SV-208: Editor Review - Manager and Editor access only
app.use("/editor-review", requireRole("manager", "editor"), express.static(
    path.join(projectRoot, "frontend", "editor-review")
));

// Sprint 4 SV-213: Video Library access for Manager and Editor
app.use("/video-library", requireRole("manager", "editor"), express.static(
    path.join(projectRoot, "video-library")
));

// Existing API routes continue beloww
app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS database_name"
        );
        res.json({
            status: "ok",
            application: "SimplyVision",
            database: rows[0].database_name
        });
    } catch (error) {
        res.status(503).json({
            status: "error",
            message: "Database unavailable"
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const [users] = await db.execute(
            "SELECT id, username, email, password_hash, role FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0 ||
            !(await bcrypt.compare(password, users[0].password_hash))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        req.session.regenerate((error) => {
            if (error) {
                return res.status(500).json({
                    message: "Could not create session"
                });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            };

            req.session.save((error) => {
                if (error) {
                    return res.status(500).json({
                        message: "Could not save session"
                    });
                }

                res.json({
                    message: "Login successful",
                    user: req.session.user
                });
            });
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            message: "Login failed"
        });
    }
});

app.get("/api/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }

    res.json({ user: req.session.user });
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.clearCookie("simplyvision.sid");
        res.json({ message: "Logged out" });
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`SimplyVision backend running at http://localhost:${PORT}`);
});
