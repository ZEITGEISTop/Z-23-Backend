const router = require("express").Router();
const firebase = require("../firebase");
const { collection, getDocs, setDoc, doc } = require("firebase/firestore");

router.get("/schedule", async (req, res) => {
  const scheduleList = await getDocs(collection(firebase.db, "schedule"));
  const arr = [];
  scheduleList.forEach((doc) => {
    arr.push(doc.data());
  });
  res.status(200).json(arr);
});

router.post("/schedule", async (req, res) => {
  try {
    const scheduleList = req.body;
    scheduleList.forEach(async (event) => {
      await setDoc(doc(firebase.db, "schedule", event.name), event);
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
