const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const {validateToken}=require('../middlewares/AuthMiddleware');
const passport=require("passport");
const loginWithGoogleApi=require("../auth/authGoogle");

const succesLoginGoogleUrl="http://localhost:3000/clientpage";
const errorLoginGoogleUrl="http://localhost:3000/sign-in";
const blockedUserUrl="http://localhost:3000/block";
// Route pour register (ajouter un client)
router.post('/user', usercontroller.add_User);


// Route pour LOGIN 
router.post('/user/login', usercontroller.login_user);

//Route pour welcome page 
router.get('/user/profile',validateToken,usercontroller.get_profile);

//Route pour se connecter via google
router.get("/login/google",passport.authenticate("google",{scope:["profile","email"]}));



//route de redirection si authentification google est reussite
router.get("/google/callback",passport.authenticate("google",{
    failureMessage:"Cannot login to Google, please Try again later !",
    failureRedirect:blockedUserUrl,
    successRedirect:succesLoginGoogleUrl
}),
(req,res)=>{
    console.log("User :",req.user);
    res.send("Thank you for signing in !");
}
);
//route de logout
router.get("/logout",usercontroller.logout);
//Route de forget password
router.post("/forgetPassword",usercontroller.forget_password);
//Route Reset password 
router.get("/resetPassword/:id/:token",usercontroller.reset_password);
//route de modification password
router.post("/resetPassword/:id/:token",usercontroller.reset_password_post);
//route pour supprimer un utlisateur avec toute les podcasts associes à lui 
//router.delete("/:id",usercontroller.deleteUser);
router.post('/send-confirmation-email/:id',usercontroller.deleteAcount);
//route pour verifier si l'utlisateur a clique sur le lien 
router.get('/confirm-user-deletion/:id',usercontroller.confirmDeleteUser);
//route pour mettre à jour user name 
router.put('/resetName/:id',usercontroller.updateUserName);
//route pour mettre à jour user email
router.put('/resetEmail/:id',usercontroller.updateUserEmail);
//route pour mettre à jour une password 
router.put('/motdepasseMAJ/:id',usercontroller.motdepasseMAJ);
//route pour compter le nombre d'utlisateurs
router.get('/users/count',usercontroller.countUsers);
//route pour recuperer tous les utlisateurs 
router.get('/allUsers',usercontroller.getAllUsers);
//route pour mettre à jour le nombre du podcast pour chaque utlisateur 
router.get('/update-num-podcasts',usercontroller.updateNumPodcasts);
//route pour bloquer un utlisateur 
router.put('/:id/block',usercontroller.blockUser)
//route pour debloquer un utlisateur 
router.put('/:id/unblock',usercontroller.unblockUser);
//route pour mettre à jour le nombre des alerts pour chaque podcast 
router.put('/update-alerts', usercontroller.update_alerts);
//route pour recuperer tous les utlisateurs actives 
router.get("/top-active-users",usercontroller.getTopActiveUsers);
module.exports = router;