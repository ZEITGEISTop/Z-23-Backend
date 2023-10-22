const router = require("express").Router();
const firebase = require("../firebase");
const bcrypt = require("bcrypt");
const {
  collection,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  doc,
} = require("firebase/firestore");

//Post a CA's data
router.post("/ca-data", async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const salt = await bcrypt.genSalt(5);
    console.log(salt);
    const referral = await bcrypt.hash(user.email, salt);
    console.log(
      referral
        .replace(/[^a-zA-Z0-9]/g, "")
        .substr(0, 8)
        .toUpperCase()
    );
    await setDoc(doc(firebase.db, "users", req.body.email), {
      ...user,
      referral: referral
        .replace(/[^a-zA-Z0-9]/g, "")
        .substr(0, 8)
        .toUpperCase(),
    });
    const p = await getDoc(doc(firebase.db, "users", req.body.email));
    res.status(200).json(p.data());
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get a CA's data
router.get("/ca-user", async (req, res) => {
  try {
    const q = await getDoc(doc(firebase.db, "users", req.query.email));
    if (q.exists()) {
      res.status(200).json(q.data());
    } else {
      res.status(403).json({ email: req.query.email });
    }
  } catch {
    res.status(500).json("Internal Server Error");
  }
});

//Get all CA's data
router.get("/leaderboard", async (req, res) => {
  const userdata = await getDocs(collection(firebase.db, "users"));
  const arr = [];
  userdata.forEach((doc) => {
    if (!doc.data().isAdmin) {
      arr.push(doc.data());
    }
  });
  const sortedArr = arr
    .sort((a, b) => b.points - a.points)
    .map((obj, index) => {
      obj.rank = index + 1;
      return obj;
    });
  res.status(200).json(sortedArr);
});

//Update a CA's data
router.put("/ca-data", async (req, res) => {
  try {
    const q = await getDoc(doc(firebase.db, "users", req.body.email));
    if ("invites" in req.body) {
      await updateDoc(doc(firebase.db, "users", req.body.email), {
        invites: q.data().invites + req.body.invites,
        points: q.data().points + req.body.points,
        history: q.data().history.push(req.body.points),
      });
    } else {
      await updateDoc(doc(firebase.db, "users", req.body.email), {
        points: q.data().points + req.body.points,
        history: q.data().history.push(req.body.points),
      });
    }
    const l = await getDoc(doc(firebase.db, "users", req.body.email));
    res.status(200).json(l.data());
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
