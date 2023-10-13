const router=require("express").Router();
const { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, sendEmailVerification } = require("firebase/auth")
const auth = getAuth();

router.post("/register", async(req,res) => {
    createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then(async(userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user);
        res.send(user);
    })
    .catch((error) => {
      res.status(403).json(error)
    });
})

router.post("/login", async(req,res)=>{
  signInWithEmailAndPassword(auth, req.body.email, req.body.password)
  .then((userCredential) => {
    const user = userCredential.user;
    if(user.emailVerified){
      res.status(200).json({...user, emailVerified: true});
    }
    else{
      sendEmailVerification(user);
      //an email is sent to your email please verify first
      res.status(401).send("Email not verified");
    }

  })
  .catch((error) => {
    if (error.code === "auth/invalid-login-credentials") {
      res.status(403).json("Invalid email or password" );
    } else {
      console.error(error);
      res.status(500).json("Internal server error" );
    }
  });
})

module.exports=router;