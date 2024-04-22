const express = require('express');
const path = require('node:path');

const app = express();

app.use(express.urlencoded({extended: false}));

app.get('/user/:userId', async (req, res) => {
    // Hayley, get the username and password from the userId
    // to do this user something like: const username = sql.query("select username where id = req.params.userId");
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
    // This will get the username and password (Hayley needs to figure out how to then check these values from the database)
    // You will need to make find if the username and password match and then return the ID here. (ensure when making the DB that the ID column is the PK and unique)
    // once u got the id, reroute the user to the user profile page
    const userId = null;
    if (userId) {
        res.redirect(`/user/${userId}`);
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    res.send('Search results for: ' + searchQuery);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
