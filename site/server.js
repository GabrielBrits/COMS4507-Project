const express = require('express');
const path = require('node:path');

const app = express();

app.use(express.urlencoded({extended: false}));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username; 
    const password = req.body.password;
    // This will get the username and password (Hayley needs to figure out how to then retrieve these values from the database)
    res.send(`Username: ${username} Password: ${password}`);
});

app.get('/search', (req, res) => {
    const searchQuery = req.query.q;
    res.send('Search results for: ' + searchQuery);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
