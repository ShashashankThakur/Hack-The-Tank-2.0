const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB Atlas connection string
const connection_string = "mongodb+srv://your-connection-string";

// Route handler for enrolling in a course
app.post('/enroll', async (req, res) => {
    const { username, courseName } = req.body;

    try {
        // Connect to MongoDB Atlas
        const client = await MongoClient.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('client'); // Use your actual database name
        const collection = db.collection('users'); // Use your actual collection name

        // Find the user by username
        const user = await collection.findOne({ username });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // Add course and days remaining to the user's object
        user.courses = user.courses || [];
        user.courses.push({ course: courseName, daysRemaining: 30 });

        // Update the user's object in the collection
        await collection.updateOne({ username }, { $set: { courses: user.courses } });

        // Close the connection
        client.close();

        res.sendStatus(200); // Send success status
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500); // Send error status
    }
});

// Route handler for fetching user information
app.get('/user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Connect to MongoDB Atlas
        const client = await MongoClient.connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('client'); // Use your actual database name
        const collection = db.collection('users'); // Use your actual collection name

        // Find the user by username
        const user = await collection.findOne({ username });

        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // Close the connection
        client.close();

        res.status(200).json(user); // Send user object as JSON response
    } catch (error) {
        console.error('Error:', error);
        res.sendStatus(500); // Send error status
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
