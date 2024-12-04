const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public')); // Serve static files from the public directory
app.use(bodyParser.json()); // Parse JSON bodies

// In-memory user store (for demo purposes)
const users = {
    'user1': 'password1', // username: password
    'user2': 'password2'
};

// Sample route for getting listings
app.get('/api/listings', (req, res) => {
    const listings = [
        { id: 1, title: 'Cozy Apartment', location: 'Downtown' },
        { id: 2, title: 'Beach House', location: 'Malibu' }
    ];
    res.json(listings);
});

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});