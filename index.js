const express = require('express');
const db = require('./firebase');
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors")
const allowedOrigins = ["https://zeitgeistrpr.com"]
const { collection, getDoc, setDoc, getDocs, updateDoc, doc } = require("firebase/firestore");
const authRoutes = require("./routes/auth")
const caRoutes = require("./routes/ca")
const mainRoutes = require("./routes/main")

app.use(cors({origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        // If the origin is in the allowed list or it's not provided (e.g., for local requests)
        callback(null, true);
      } else {
        // If the origin is not allowed
        callback(new Error('Not allowed by CORS'));
      }
    },}));

app.use(express.json());

app.use(authRoutes)
app.use(caRoutes)
app.use(mainRoutes)

app.listen(5000, () => {
    console.log("Running on "+ 5000);
})