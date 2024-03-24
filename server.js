const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const { MongoClient } = require('mongodb');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://u22cs060:vFs4jYRzreSqxbxc@sasfat2slim.qnrv9eb.mongodb.net/SAS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

// Define Admin model schema
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Admin = mongoose.model('Admin', adminSchema);

// Configure Passport local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const admin = await Admin.findOne({ username: username });
        if (!admin) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        if (admin.password !== password) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, admin);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const admin = await Admin.findById(id);
        return done(null, admin);
    } catch (error) {
        return done(error);
    }
});





// Con figure Express app
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client','index2.html'));
});
// Define route handler for home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Define login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home', // Redirect to the home page upon successful login
    failureRedirect: '/login', // Redirect back to the login page upon failed login
    failureFlash: true // Enable flashing of error messages
}));

// Define route handler for login page
app.get('/login', (req, res) => {
    // Check if there are any error messages flashed from the previous login attempt
    const errorMessage = req.flash('error')[0];
    res.sendFile(path.join(__dirname, 'login.html')); // Serve the login HTML file
});
app.use(express.static('public'));

// Define route handler for Viz page
app.get('/viz', (req, res) => {
    res.sendFile(path.join(__dirname,  'public','index.html'));
});

// Serve static files from the 'public' directory


// Define route handler for UserInfo page
app.get('/userinfo', (req, res) => {
    // Assuming userinfo.html is in the same directory as server.js
    res.sendFile(path.join(__dirname, 'userinfo.html'));
});

const MONGODB_URI = 'YOur';

// Initialize Twilio client with your credentials
const client = twilio('', '');

// MongoDB schema and model setup
const Client = require('./models/client'); // Assuming you have a client model defined

// Function to send WhatsApp message
function sendWhatsAppMessage(to, message) {
    client.messages.create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:' + to
    }).then(message => console.log('WhatsApp message sent:', message.sid))
    .catch(error => console.error('Error sending WhatsApp message:', error));
}

// Schedule sending of diet plan every day at a specific time (e.g., 8:00 AM)
cron.schedule('0 8 * * *', async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Retrieve clients from the database whose daysRemaining is more than 0
        const clients = await Client.find({ daysRemaining: { $gt: 0 } });

        // Retrieve diet plan for the day
        const dietPlan = getDietPlanForTheDay(); // You need to implement this function

        // Send diet plan to each client's WhatsApp number
        clients.forEach(client => {
            sendWhatsAppMessage(client.phoneNumber, dietPlan);
        });
    } catch (error) {
        console.error('Error sending diet plan:', error);
    } finally {
        // Close MongoDB connection
        mongoose.disconnect();
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// server.js

// const express = require('express');
// const path = require('path');
// const MongoClient = require('mongodb').MongoClient;
// const app = express();
// const port = 13000;

// // MongoDB Atlas connection string

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname)));

// Route handler for the root URL ("/")

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
