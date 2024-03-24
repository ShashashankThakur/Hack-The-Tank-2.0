const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var x="(SIGN IN)";
// Generate a random 32-byte string
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));



// Initialize Passport and session support
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Atlas connection string
const connection_string = "mongodb+srv://u22cs060:vFs4jYRzreSqxbxc@sasfat2slim.qnrv9eb.mongodb.net/SAS";

// Serve clientlog.html file for the root endpoint '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index2.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'register.html'));
});
// Route handler for registering a user
app.post('/register', async (req, res) => {
    try {
        const { fullname, phone, password, sex, height, weight, diseases, username } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Connect to MongoDB Atlas
        const client = await MongoClient.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('SAS');
        const collection = db.collection('users');

        // Insert data into the collection
        await collection.insertOne({ fullname, phone, password: hashedPassword, sex, height, weight, diseases, username });
     
        // Close the connection
        client.close();

        res.status(200).send('User registered successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route handler for user login
app.post('/clientlog', async (req, res) => {
    try {
        const { username, password } = req.body;

        //Connect to MongoDB Atlas
        const client = await MongoClient.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('SAS');
        const collection = db.collection('users');

        // Find user by username
        const user = await collection.findOne({ username , password});

        if (user) {
            client.close();

            res.redirect('/hm');
            
            return;
        }

        // Compare passwords
        
        else {
            // Passwords don't match, return error
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve hm.html file for the '/hm' endpoint
app.get('/hm', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'hm.html'));
});

app.use(express.static(path.join(__dirname, 'client')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
