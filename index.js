
const firebaseConfig = {
    apiKey: "AIzaSyDRGJ4_fUs_D2XFz4VxAHYrjY2z3FVw3ug",
    authDomain: "vams-181c6.firebaseapp.com",
    projectId: "vams-181c6",
    storageBucket: "vams-181c6.appspot.com",
    messagingSenderId: "499943126450",
    appId: "1:499943126450:web:25103cdbd36c3939cfa0ab"
  };
  
const express = require('express');
const authRoute = require('./routes/authRoutes');

// Initialize Express
const app = express();
const port = process.env.PORT || 8080;

// Permit JSON through Express
app.use(express.json());
app.use('/auth',authRoute);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports.firebaseConfig = firebaseConfig;