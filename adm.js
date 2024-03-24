// // Import required modules
// const mongoose = require('mongoose');

// // Define schema for admins collection
// const adminSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });

// // Create Admin model based on the schema
// const Admin = mongoose.model('Admin', adminSchema);

// // Connect to MongoDB Atlas
// mongoose.connect('mongodb+srv://u22cs060:vFs4jYRzreSqxbxc@sasfat2slim.qnrv9eb.mongodb.net/SAS', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB Atlas');
//     // Add a dummy admin
//     const dummyAdmin = new Admin({
//         username: 'admin',
//         password: 'admin123'
//     });
//     // Save the dummy admin to the database
//     dummyAdmin.save()
//         .then(() => {
//             console.log('Dummy admin added successfully');
//         })
//         .catch(err => {
//             console.error('Error adding dummy admin:', err);
//         });
// }).catch(err => {
//     console.error('Error connecting to MongoDB Atlas:', err);
// });


const mongoose = require('mongoose');

// Define schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true },
    disease: { type: String, enum: ['thyroid', 'diabetes', 'blood pressure', 'fatigue', 'anxiety'] },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    daysRemaining: { type: Number, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    course: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
});

// Create User model based on the schema
const User = mongoose.model('User', userSchema);

// MongoDB Atlas connection string
const connection_string = "mongodb+srv://u22cs060:vFs4jYRzreSqxbxc@sasfat2slim.qnrv9eb.mongodb.net/SAS";

// Connect to MongoDB Atlas
mongoose.connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(async () => {
    console.log('Connected to MongoDB Atlas');

    // Sample user entries
    const users =
        [
            {
              "name": "John Doe",
              "gender": "Male",
              "age": 35,
              "disease": "diabetes",
              "weight": 75,
              "height": 180,
              "daysRemaining": 30,
              "phoneNumber": "1234567890",
              "course": "beginner",
              "username": "john123",
              "password": "password123"
            },
            {
              "name": "Jane Smith",
              "gender": "Female",
              "age": 28,
              "disease": "thyroid",
              "weight": 65,
              "height": 165,
              "daysRemaining": 30,
              "phoneNumber": "9876543210",
              "course": "intermediate",
              "username": "jane456",
              "password": "password456"
            },
            {
              "name": "Michael Johnson",
              "gender": "Male",
              "age": 40,
              "disease": "blood pressure",
              "weight": 80,
              "height": 175,
              "daysRemaining": 30,
              "phoneNumber": "5551234567",
              "course": "advanced",
              "username": "michael789",
              "password": "password789"
            },
            {
              "name": "Emily Brown",
              "gender": "Female",
              "age": 32,
              "disease": "fatigue",
              "weight": 70,
              "height": 170,
              "daysRemaining": 30,
              "phoneNumber": "7779876543",
              "course": "beginner",
              "username": "emily321",
              "password": "password321"
            },
            {
              "name": "David Lee",
              "gender": "Male",
              "age": 45,
              "disease": "anxiety",
              "weight": 85,
              "height": 185,
              "daysRemaining": 30,
              "phoneNumber": "9995554321",
              "course": "expert",
              "username": "david654",
              "password": "password654"
            },
            {
              "name": "Sarah Wilson",
              "gender": "Female",
              "age": 30,
              "disease": "diabetes",
              "weight": 70,
              "height": 170,
              "daysRemaining": 30,
              "phoneNumber": "5559876543",
              "course": "intermediate",
              "username": "sarah789",
              "password": "password789"
            },
            {
              "name": "Matthew Taylor",
              "gender": "Male",
              "age": 38,
              "disease": "blood pressure",
              "weight": 82,
              "height": 180,
              "daysRemaining": 30,
              "phoneNumber": "1235556789",
              "course": "advanced",
              "username": "matthew123",
              "password": "password123"
            },
            {
              "name": "Emma Garcia",
              "gender": "Female",
              "age": 25,
              "disease": "thyroid",
              "weight": 60,
              "height": 160,
              "daysRemaining": 30,
              "phoneNumber": "4567890123",
              "course": "beginner",
              "username": "emma456",
              "password": "password456"
            },
            {
              "name": "Christopher Martinez",
              "gender": "Male",
              "age": 42,
              "disease": "anxiety",
              "weight": 88,
              "height": 190,
              "daysRemaining": 30,
              "phoneNumber": "7891234567",
              "course": "expert",
              "username": "christopher789",
              "password": "password789"
            },
            {
              "name": "Olivia Lopez",
              "gender": "Female",
              "age": 35,
              "disease": "diabetes",
              "weight": 75,
              "height": 165,
              "daysRemaining": 30,
              "phoneNumber": "3219876543",
              "course": "intermediate",
              "username": "olivia123",
              "password": "password123"
            },
            {
              "name": "Daniel Hernandez",
              "gender": "Male",
              "age": 48,
              "disease": "blood pressure",
              "weight": 90,
              "height": 180,
              "daysRemaining": 30,
              "phoneNumber": "6547890123",
              "course": "advanced",
              "username": "daniel456",
              "password": "password456"
            },
            {
              "name": "Isabella Gonzales",
              "gender": "Female",
              "age": 29,
              "disease": "fatigue",
              "weight": 65,
              "height": 170,
              "daysRemaining": 30,
              "phoneNumber": "9873216540",
              "course": "beginner",
              "username": "isabella789",
              "password": "password789"
            },
            {
              "name": "William Perez",
              "gender": "Male",
              "age": 33,
              "disease": "thyroid",
              "weight": 78,
              "height": 175,
              "daysRemaining": 30,
              "phoneNumber": "4561237890",
              "course": "expert",
              "username": "william123",
              "password": "password123"
            },
            {
              "name": "Sophia Flores",
              "gender": "Female",
              "age": 31,
              "disease": "diabetes",
              "weight": 72,
              "height": 168,
              "daysRemaining": 30,
              "phoneNumber": "9876543211",
              "course": "intermediate",
              "username": "sophia456",
              "password": "password456"
            },
            {
              "name": "James Sanchez",
              "gender": "Male",
              "age": 37,
              "disease": "blood pressure",
              "weight": 85,
              "height": 182,
              "daysRemaining": 30,
              "phoneNumber": "1239874560",
              "course": "advanced",
              "username": "james789",
              "password": "password789"
            }];
    

    try {
        // Insert all users to the database
        await User.insertMany(users);
        console.log('Users inserted successfully.');
    } catch (error) {
        console.error('Error inserting users:', error);
    } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});
