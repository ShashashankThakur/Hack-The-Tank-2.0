const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const twilio = require('twilio');
const cron = require('node-cron');
const { MongoClient } = require('mongodb');

const bcrypt = require('bcrypt');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://u22cs060:vFs4jYRzreSqxbxc@sasfat2slim.qnrv9eb.mongodb.net/SAS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

// Define user model schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    is_admin: Boolean // Adding a field to identify admin users
});

const User = mongoose.model('User', userSchema);
const mongoURI = 'mongodb+srv://u22cs060:vFs4jYRzreSqxbxc@sasfat2slim.qnrv9eb.mongodb.net/SAS';

// Configure Passport local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

// Configure Express app
const app = express();
const uri = 'mongodb+srv://u22cs060:vFs4jYRzreSqxbxc@sasfat2slim.qnrv9eb.mongodb.net/SAS';

// Connect to MongoDB Atlas
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB Atlas');
        const db = client.db('SAS');
        const usersCollection = db.collection('users');

        // Endpoint to fetch data
        app.get('/usersData', (req, res) => {
            usersCollection.find().toArray()
                .then(data => {
                    res.json(data);
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                    res.status(500).send('Error fetching data');
                });
        });
    })
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // Add express-flash middleware
app.use(express.static(path.join(__dirname, '/client')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','index2.html'));
});

// Define route handler for home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Define login route
app.post('/login', passport.authenticate('local', {
    // Custom authentication callback
    failureRedirect: '/login', // Redirect back to login page upon failed login
    failureFlash: true // Enable flashing of error messages
}), (req, res) => {
    // Check if user is authenticated and is an admin
    if (req.isAuthenticated() && req.user.is_admin) {
        res.redirect('/home'); // Redirect admin to home page
    } else {
        res.redirect('/new'); // Redirect normal user to new page
    }
});



// Define route handler for login page
app.get('/login', (req, res) => {
    // Check if there are any error messages flashed from the previous login attempt
    const errorMessage = req.flash('error')[0];
    res.sendFile(path.join(__dirname, 'login.html')); // Serve the login HTML file
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define route handler for Viz page
app.get('/viz', (req, res) => {
    if (req.isAuthenticated() && req.user.is_admin) {
        // Admin user, proceed to '/viz'
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        // Normal user, redirect to '/new'
        res.redirect('/new');
    }
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
        const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
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
// Route for normal users
app.get('/new', (req, res) => {
    res.send('Welcome, Normal User!');
});

const accountSid = 'ACa15b5e54c85a6a8b292092f53a1384c1';
const authToken = 'bdf8bc4235a0660b3e4df49b53b045af';
const twilioNumber = '+14155238886';


// MongoDB Atlas connection string

// Twilio credentials

const client = twilio(accountSid, authToken);

async function sendWhatsAppMessage(to, message) {
    try {
        await client.messages.create({
            body: message,
            from: 'whatsapp:' + twilioNumber,
            to: 'whatsapp:' + to
        });
        console.log(`WhatsApp message sent to ${to}: ${message}`);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
}

async function sendDietPlans() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();

        const database = client.db('SAS'); // Replace 'YOUR_DATABASE_NAME' with your database name
        const usersCollection = database.collection('users');

        // Fetch users from MongoDB and send WhatsApp messages
        const users = await usersCollection.find().toArray();

        for (const user of users) {
            const { phoneNumber, dietPlan } = user;
            const message = `Dear ${user.name}, your diet plan for today is: ${dietPlan}.`;
            await sendWhatsAppMessage(phoneNumber, message);
        }

        console.log('Diet plans sent successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

// Schedule the sending process to run every day at 8 am
cron.schedule('0 8 * * *', () => {
    console.log('Running sendDietPlans job...');
    sendDietPlans();
}, {
    scheduled: true,
    timezone: "America/New_York" // Update with your timezone, e.g., 'America/New_York'
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
