const router = require("express").Router();
const firebase = require("../firebase");
const bcrypt = require("bcrypt");
const {
  getDoc,
  setDoc,
  doc,
} = require("firebase/firestore");

//Post a user's data
router.post("/main-data", async (req, res) => {
  try {
    const user = req.body;
    await setDoc(doc(firebase.db, "mainUsers", req.body.email), user);
    const p = await getDoc(doc(firebase.db, "mainUsers", req.body.email));
    res.status(200).json(p.data());
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get a user's data
router.get("/main-user", async (req, res) => {
  try {
    const q = await getDoc(doc(firebase.db, "mainUsers", req.query.email));
    if (q.exists()) {
      res.status(200).json(q.data());
    } else {
      res.status(403).json({ email: req.query.email });
    }
  } catch {
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
