const router = require("express").Router();
const firebase = require("../firebase");
const {
  collection,
  setDoc,
  getDocs,
  doc,
} = require("firebase/firestore");

//Post an event
router.post("/announcement", async (req, res) => {
  try {
    const announcement = req.body;
      await setDoc(
        doc(firebase.db, "announcements", announcement.heading),
        announcement.data
      );
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json(e);
  }
});


//Get all events
router.get("/announcements", async (req, res) => {
  try {
    const eventsdata = await getDocs(collection(firebase.db, "announcements"));
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
