const express = require('express');
const path = require('node:path');
//install oackage and save to package.jspn npm install express-session --save
const bcrypt = require('bcrypt');
//install package and save to package.json: npm install bcrypt --save
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
//install package and save to package.json: npm install express-rate-limit --save
const rateLimit = require('express-rate-limit');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Use only in HTTPS environments
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Apply rate limiting to login routes
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 100 requests per windowMs
    message: 'Too many login attempts from this IP, please try again later.'
});
app.use('/login', loginRateLimiter);

const saltRounds = 10;

// Database connection
let db = new sqlite3.Database('mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the mydatabase.db database.');
    }
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        
        res.redirect('/login');
    }
}

// Content Security Policy Middleware
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'none';");
    next();
});

app.get('/api/data', isAuthenticated, (req, res) => {
    db.all("SELECT id, name FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.get('/user/:userId', isAuthenticated, (req, res) => {
    const userId = req.params.userId;
    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        if (row) {
            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>User Profile</title>
                    <style>
                        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                        .container { text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>${row.name}'s Profile</h1>
                        <p><strong>Username:</strong> ${row.name}</p>
                    </div>
                </body>
                </html>
            `;
            res.send(html);
        } else {
            res.send('Invalid User');
        }
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/login_invalid', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/invalid_login.html'));
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    db.get("SELECT * FROM users WHERE name = ?", [username], (err, row) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        if (row && bcrypt.compareSync(password, row.password)) {
            req.session.loggedIn = true;
            req.session.userId = row.id;
            res.redirect(`/user/${row.id}`);
        } else {
            res.redirect('/login_invalid');
        }
    });
});

app.get('/search', isAuthenticated, (req, res) => {
    const searchQuery = req.query.q;
    res.send('Search results for: ' + searchQuery);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/user', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/user.html'));
});

app.get('/admin', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/admin.html'));
});
app.get('/login', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Store user in the database
        db.run(`INSERT INTO users (name, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
            if (err) {
                console.error(err.message);
                res.status(500).send("Failed to register the user.");
            } else {
                console.log(`A new user has been added with ID ${this.lastID}`);
                res.send("User registered successfully!");
            }
        });
    } catch (error) {
        console.error('Error hashing password: ', error);
        res.status(500).send("Error registering user.");
    }
});

app.listen(4000, () => console.log('App is listening on port 4000.'));

