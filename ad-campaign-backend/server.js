const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001; // Use a different port than the React app

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yourusername',
    password: 'yourpassword',
    database: 'ad_campaign'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// User registration endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
            res.status(500).send('Error registering new user');
            return;
        }
        res.status(201).send('User registered successfully');
    });
});

// User login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            res.status(500).send('Error during login');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid email or password');
            return;
        }

        const user = results[0];
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            res.status(401).send('Invalid email or password');
            return;
        }

        // Generate a token or session here
        res.status(200).send('Login successful');
    });
});

// Ad upload endpoint
app.post('/ads', (req, res) => {
    const { userId, title, description } = req.body;

    const query = 'INSERT INTO ads (user_id, title, description) VALUES (?, ?, ?)';
    connection.query(query, [userId, title, description], (err, results) => {
        if (err) {
            res.status(500).send('Error uploading ad');
            return;
        }
        res.status(201).send('Ad uploaded successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
