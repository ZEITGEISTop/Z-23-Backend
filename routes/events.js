const router = require("express").Router();
const firebase = require("../firebase");
const {
  collection,
  getDoc,
  setDoc,
  getDocs,
  doc,
} = require("firebase/firestore");

//Post an event
router.post("/events", async (req, res) => {
  try {
    const eventList = req.body;
    eventList.forEach(async (event) => {
      await setDoc(doc(firebase.db, "events", event.name), event);
    })
    res.status(200).json({"success": true});
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get an event
router.get("/events", async (req, res) => {
  try {
    const q = await getDoc(doc(firebase.db, "events", req.query.name));
    if (q.exists()) {
      res.status(200).json(q.data());
    } else {
      res.status(403).json({ name: req.query.name });
    }
  } catch {
    res.status(500).json("Internal Server Error");
  }
});

//Get all events
router.get("/allEvents", async (req, res) => {
  try {
    const eventsdata = await getDocs(collection(firebase.db, "events"));
    const arr = [];
    eventsdata.forEach((doc) => {
      arr.push(doc.data());
    });
    res.status(200).json(arr);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
