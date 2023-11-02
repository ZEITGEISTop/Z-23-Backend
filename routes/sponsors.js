const router = require("express").Router();
const firebase = require("../firebase");
const { collection, getDocs} = require("firebase/firestore");

router.get("/sponsors", async (req, res) => {
  const team = await getDocs(collection(firebase.db, "sponsors"));
  const arr = [];
  team.forEach((doc) => {
    arr.push(doc.data());
  });
  res.status(200).json(arr);
});

module.exports = router;
