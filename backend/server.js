const express = require('express');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const predictRoute = require("./routes/predictRoute");
 
require('dotenv').config(); // This loads the .env file

// Your other middleware and routes here...

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Atlas connected successfully!');
        console.log('📊 Database:', process.env.DB_NAME);
    })
    .catch(err => {
        console.log('❌ MongoDB connection failed!');
        console.error('Error details:', err.message);
    });

// Optional: Add connection event listeners
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚪ Mongoose disconnected');
});

app.use("/api", predictRoute);
 

// ✅ THIS GOES HERE - at the bottom of your server.js
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});