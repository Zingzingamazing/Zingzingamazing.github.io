const bcrypt = require('bcryptjs');

// Replace 'your_password' with the desired admin password
const password = 'alpha';
const hashedPassword = bcrypt.hashSync(password, 10);

console.log(`Hashed password: ${hashedPassword}`);
