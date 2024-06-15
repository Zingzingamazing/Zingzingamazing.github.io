require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

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

        app.post('/login', async (req, res) => {
            try {
                const { email, password } = req.body;
                const [results] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

                if (results.length === 0) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                const user = results[0];
                const isValidPassword = bcrypt.compareSync(password, user.password);

                if (!isValidPassword) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }

                res.status(200).json(user);
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

                res.status(200).json(admin);
            } catch (err) {
                console.error('Error during admin login:', err);
                res.status(500).json({ message: 'Error during admin login' });
            }
        });

        app.post('/ads', upload.single('image'), async (req, res) => {
            try {
                const { userId, title, description, userType, publisher } = req.body;
                const imageUrl = `/uploads/${req.file.filename}`;

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

        app.get('/users', async (req, res) => {
            try {
                const [results] = await connection.execute('SELECT * FROM users');
                res.status(200).json(results);
            } catch (err) {
                console.error('Error fetching users:', err);
                res.status(500).json({ message: 'Error fetching users' });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();
