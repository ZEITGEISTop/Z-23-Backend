const router = require("express").Router();
const firebase = require("../firebase");
const { collection, getDocs, setDoc, doc } = require("firebase/firestore");

router.get("/team", async (req, res) => {
  const team = await getDocs(collection(firebase.db, "teams"));
  const arr = [];
  team.forEach((doc) => {
    arr.push(doc.data());
  });
  res.status(200).json(arr);
});

module.exports = router;
