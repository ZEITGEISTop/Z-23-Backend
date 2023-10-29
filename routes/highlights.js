const router = require("express").Router();
const firebase = require("../firebase");
const { collection, getDocs } = require("firebase/firestore");

router.get("/highlights", async (req, res) => {
  const highlights = await getDocs(collection(firebase.db, "highlights"));
  const arr = [];
  highlights.forEach((doc) => {
    arr.push(doc.data());
  });
  res.status(200).json(arr);
});

module.exports = router;
