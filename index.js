const express = require('express');
const db = require('./firebase');
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors")
const corsOptions = {
    origin: 'https://zeitgeistrpr.com',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
const { collection, getDoc, setDoc, getDocs, updateDoc, doc } = require("firebase/firestore");
const authRoutes = require("./routes/auth")

app.post("/data", async (req, res) => {
    try {
        const user = req.body;
        console.log(user)
        const salt = await bcrypt.genSalt(5);
        console.log(salt)
        const referral = await bcrypt.hash(user.email, salt);
        console.log(referral.replace(/[^a-zA-Z0-9]/g, '')
            .substr(0, 8)
            .toUpperCase())
        await setDoc(doc(db, "users", req.body.email), {
            ...user, referral: referral.replace(/[^a-zA-Z0-9]/g, '')
                .substr(0, 8)
                .toUpperCase()
        });
        const p = await getDoc(doc(db, "users", req.body.email));
        res.status(200).json(p.data());
    } catch (e) {
        res.status(500).json(e);
    }
})

app.post("/events", async (req, res) => {
    try {
        const event = req.body;
        console.log(event)
        await setDoc(doc(db, "events", req.body.name), event);
        const p = await getDoc(doc(db, "events", req.body.name));
        res.status(200).json(p.data());
        console.log(p)
    } catch (e) {
        res.status(500).json(e);
    }
})

app.get("/user", async (req, res) => {
    try{

        const q = await getDoc(doc(db, "users", req.query.email));
        if (q.exists()) {
            res.status(200).json(q.data());
        }
        else {
            res.status(403).json({email: req.query.email});
        }
    }
    catch{
        res.status(500).json("Internal Server Error")
    }
})
app.get("/leaderboard", async (req, res) => {
    const userdata = await getDocs(collection(db, "users"));
    const arr = [];
    userdata.forEach((doc) => {
        if(!doc.data().isAdmin){
            arr.push(doc.data());
        }
    });
    const sortedArr = arr.sort((a, b) => b.points - a.points).map((obj, index) => {
        obj.rank = index + 1
        return obj
    })
    res.status(200).json(sortedArr);
})

app.put("/data", async (req, res) => {
    try {
        const q = await doc(db, "users", req.body.email);
        if ("invites" in req.body) {
            await updateDoc(q, {
                invites: req.body.invites,
                points: req.body.points
            });
        }
        else {
            await updateDoc(q, {
                points: req.body.points
            });
        }
        const l = await getDoc(doc(db, "users", req.body.email));
        res.status(200).json(l.data());
    }
    catch (e) {
        res.status(500).json(e);
    }
})

app.use(authRoutes)
app.listen(5000, () => {
    console.log("Running on "+ 5000);
})