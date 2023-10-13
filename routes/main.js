const router = require("express").Router();

//Post an event
router.post("/events", async (req, res) => {
  try {
    const event = req.body;
    await setDoc(doc(db, "events", req.body.name), event);
    const p = await getDoc(doc(db, "events", req.body.name));
    res.status(200).json(p.data());
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get an event
router.get("/events", async (req, res) => {
  try {
    const q = await getDoc(doc(db, "events", req.query.name));
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
  const eventsdata = await getDocs(collection(db, "events"));
  const arr = [];
  eventsdata.forEach((doc) => {
    arr.push(doc.data());
  });
  res.status(200).json(arr);
});

module.exports = router;