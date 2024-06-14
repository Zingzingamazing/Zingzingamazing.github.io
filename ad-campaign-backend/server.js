const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yourusername', // Replace with your MySQL username
    password: 'yourpassword', // Replace with your MySQL password
    database: 'ad_campaign'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error('Error checking existing user:', err);
            res.status(500).json({ message: 'Error checking existing user' });
            return;
        }

        if (results.length > 0) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        connection.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error registering new user:', err);
                res.status(500).json({ message: 'Error registering new user', error: err });
                return;
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Error during login' });
            return;
        }

        if (results.length === 0) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const user = results[0];
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        res.status(200).json(user);
    });
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ message: 'Error fetching users' });
            return;
        }
        res.status(200).json(results);
    });
});

app.post('/ads', (req, res) => {
    const { userId, title, description } = req.body;

    const query = 'INSERT INTO ads (user_id, title, description) VALUES (?, ?, ?)';
    connection.query(query, [userId, title, description], (err, results) => {
        if (err) {
            console.error('Error uploading ad:', err);
            res.status(500).json({ message: 'Error uploading ad' });
            return;
        }
        res.status(201).json({ message: 'Ad uploaded successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
