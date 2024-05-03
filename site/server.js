const express = require('express');
const path = require('node:path');

const app = express();

app.use(express.urlencoded({extended: false}));

const sqlite3 = require('sqlite3').verbose();
//const insertData = `INSERT INTO users (name, password) VALUES (?, ?)`;

// Database connection
let db = new sqlite3.Database('mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the mydatabase.db database.');
    }
});

//call this api to get database details in html pages
app.get('/api/data', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});


app.get('/user/:userId', async (req, res) => {
    const query = 'SELECT * FROM users where id = ?';    
    const userId = req.params.userId;
    console.log(userId);
    db.get(query, [userId], (err, row) => {
        if (row) {
            const html = `
                <!DOCTYPE html>
                <style>
                    body {
                         margin: 0;
                         padding: 0;
                         display: flex;
                         justify-content: center;
                         align-items: center;
                         height: 100vh;
                    }

                    .container {
                        text-align: center;
                    }
                </style>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>User Profile</title>
                </head>
                    <div class="container">
                        <h1>${row.name}'s Profile</h1>    
                        <p><strong>Username:</strong> ${row.name}</p>
                        <p><strong>Password:</strong> ${row.password}</p>
                        <div class="form-group">
                            <a href="#" id="logout_link">Logout</a>
                        </div>

                        <script>
                            document.getElementById("logout_link").addEventListener("click", function() {
                                window.location.href = "/";
                            });
                        </script>
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
    let query = `SELECT * FROM users WHERE name = "${username}" AND password = "${password}"`;
    const userId = null;
    db.get(query, (err, row) => {
       if (err) {
            
            res.status(500).send('Database error');
            return;
        }
        console.log(row)
        if (row) {
            let userId = row.id;
            if (username === "admin") {
                console.log('correct admin')
                res.redirect(`/user/${userId}`);
            } else {
                console.log('user')
                res.redirect(`/user/${userId}`);
            }
                
        } else {
            console.log('invalid password')
            res.redirect('/login_invalid');
        }
    });


});



app.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    res.send('Search results for: ' + searchQuery);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//redirect to the user page
app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/public/user.html');
});

//redirect to the admin page
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

app.listen(3000, () => console.log('App is listening on port 3000.'));
