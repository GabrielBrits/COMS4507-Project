const express = require('express');
const path = require('node:path');

const app = express();

app.use(express.urlencoded({extended: false}));

const sqlite3 = require('sqlite3').verbose();
//const insertData = `INSERT INTO users (name, password) VALUES (?, ?)`;

// Database connection
let db = new sqlite3.Database('../mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
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
    // Hayley, get the username and password from the userId
    // to do this user something like: const username = sql.query("select username where id = req.params.userId");
    // IDRK what you want me to do here so if i havent already created a solution with what ive done let me know
    const username = null;
    const password = null;
    if (username) {
        res.send(`Username: ${username}<br>Password: ${password}`);
    } else {
        res.send('User not found');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password;
    const query = 'SELECT * FROM users WHERE name = ?';
    // This will get the username and password (Hayley needs to figure out how to then check these values from the database)
    // You will need to make find if the username and password match and then return the ID here. (ensure when making the DB that the ID column is the PK and unique)
    // once u got the id, reroute the user to the user profile page
    // Sure thing.
    const userId = null;

    db.get(query, [username], (err, row) => {
        if (err) {
            
            res.status(500).send('Database error');
            return;
        }
        if (row) {
            // Compare the password submitted with the one in the database
            if (row.password === password) {
                let userId = row.id;
                
                //res.redirect(`/user/${userId}`);
                console.log(username)
                if (username === "admin") {
                    console.log('correct admin')
                    res.redirect('/admin');
                } else {
                    console.log('user')
                    res.redirect('/user');
                }
                
            } else {
                console.log('invalid password')
                res.redirect('/');
            }
        } else {
            res.send('User not found');
        }
    });


});

app.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    res.send('Search results for: ' + searchQuery);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
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
