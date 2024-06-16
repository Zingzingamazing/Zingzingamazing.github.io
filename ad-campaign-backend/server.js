const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Define allowed origins
const allowedOrigins = ['http://localhost:3000']; // Replace with your frontend URL

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(bodyParser.json());

// Helmet configuration with crossOriginResourcePolicy set to false
app.use(helmet({
    crossOriginResourcePolicy: false
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware to authenticate and attach user info to req
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        req.user = decoded;
        next();
    });
};

// Middleware to check if the user is an admin
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        req.user = decoded;
        next();
    });
};

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Database connected successfully');

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        });

        const upload = multer({ storage });

        app.post('/register', async (req, res) => {
            try {
                const { username, email, password } = req.body;
                const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

                if (existingUser.length > 0) {
                    return res.status(409).json({ message: 'User already exists' });
                }

                const hashedPassword = bcrypt.hashSync(password, 10);
                await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
                res.status(201).json({ message: 'User registered successfully' });
            } catch (err) {
                console.error('Error registering new user:', err);
                res.status(500).json({ message: 'Error registering new user', error: err });
            }
        });

        app.post('/signin', async (req, res) => {
            try {
                const { email, password } = req.body;
                console.log('Login request received for email:', email);

                const [results] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
                console.log('Query results:', results);

                if (results.length === 0) {
                    console.log('No user found with this email');
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                const user = results[0];
                const isValidPassword = bcrypt.compareSync(password, user.password);
                console.log('Password comparison result:', isValidPassword);

                if (!isValidPassword) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                // Create a token with username included
                const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, {
                    expiresIn: '24h' // expires in 24 hours
                });

                res.status(200).json({ token, username: user.username });
            } catch (err) {
                console.error('Error during login:', err);
                res.status(500).json({ message: 'Error during login' });
            }
        });

        app.post('/admin/register', async (req, res) => {
            try {
                const { username, email, password } = req.body;
                const [existingAdmin] = await connection.execute('SELECT * FROM admins WHERE email = ?', [email]);

                if (existingAdmin.length > 0) {
                    return res.status(409).json({ message: 'Admin already exists' });
                }

                const hashedPassword = bcrypt.hashSync(password, 10);
                await connection.execute('INSERT INTO admins (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
                res.status(201).json({ message: 'Admin registered successfully' });
            } catch (err) {
                console.error('Error registering new admin:', err);
                res.status(500).json({ message: 'Error registering new admin', error: err });
            }
        });

        app.post('/admin/login', async (req, res) => {
            try {
                const { email, password } = req.body;
                const [results] = await connection.execute('SELECT * FROM admins WHERE email = ?', [email]);

                if (results.length === 0) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                const admin = results[0];
                const isValidPassword = bcrypt.compareSync(password, admin.password);

                if (!isValidPassword) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                // Create a token with admin credentials included
                const token = jwt.sign({ id: admin.id, email: admin.email, username: admin.username, isAdmin: true }, process.env.JWT_SECRET, {
                    expiresIn: '24h' // expires in 24 hours
                });

                res.status(200).json({ token });
            } catch (err) {
                console.error('Error during admin login:', err);
                res.status(500).json({ message: 'Error during admin login' });
            }
        });

        app.post('/ads', [authenticate, upload.single('image')], async (req, res) => {
            try {
                const { title, description, userType, publisher } = req.body;
                const userId = req.user.id;

                if (!title || !description || !userType || !publisher || !req.file) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                const imageUrl = `/uploads/${req.file.filename}`;

                console.log('Ad submission:', {
                    userId,
                    title,
                    description,
                    imageUrl,
                    userType,
                    publisher
                });

                const query = 'INSERT INTO ads (user_id, title, description, image_url, user_type, publisher, approved) VALUES (?, ?, ?, ?, ?, ?, 0)';
                await connection.execute(query, [userId, title, description, imageUrl, userType, publisher]);
                res.status(201).json({ message: 'Ad submitted for approval' });
            } catch (err) {
                console.error('Error uploading ad:', err);
                res.status(500).json({ message: 'Error uploading ad' });
            }
        });

        app.get('/ads/pending', async (req, res) => {
            try {
                const [results] = await connection.execute('SELECT * FROM ads WHERE approved = 0');
                res.status(200).json(results);
            } catch (err) {
                console.error('Error fetching pending ads:', err);
                res.status(500).json({ message: 'Error fetching pending ads' });
            }
        });

        app.post('/ads/approve/:id', async (req, res) => {
            try {
                const adId = req.params.id;
                await connection.execute('UPDATE ads SET approved = 1 WHERE id = ?', [adId]);
                res.status(200).json({ message: 'Ad approved successfully' });
            } catch (err) {
                console.error('Error approving ad:', err);
                res.status(500).json({ message: 'Error approving ad' });
            }
        });

        app.post('/ads/reject/:id', async (req, res) => {
            try {
                const adId = req.params.id;
                await connection.execute('DELETE FROM ads WHERE id = ?', [adId]);
                res.status(200).json({ message: 'Ad rejected successfully' });
            } catch (err) {
                console.error('Error rejecting ad:', err);
                res.status(500).json({ message: 'Error rejecting ad' });
            }
        });

        app.get('/ads', async (req, res) => {
            try {
                const [results] = await connection.execute('SELECT * FROM ads WHERE approved = 1');
                res.status(200).json(results);
            } catch (err) {
                console.error('Error fetching ads:', err);
                res.status(500).json({ message: 'Error fetching ads' });
            }
        });

        app.get('/users', authenticateAdmin, async (req, res) => {
            try {
                const [results] = await connection.execute('SELECT * FROM users');
                res.status(200).json(results);
            } catch (err) {
                console.error('Error fetching users:', err);
                res.status(500).json({ message: 'Error fetching users' });
            }
        });

        app.delete('/users/:id', authenticateAdmin, async (req, res) => {
            try {
                const userId = req.params.id;
                await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
                res.status(200).json({ message: 'User deleted successfully' });
            } catch (err) {
                console.error('Error deleting user:', err);
                res.status(500).json({ message: 'Error deleting user' });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();
