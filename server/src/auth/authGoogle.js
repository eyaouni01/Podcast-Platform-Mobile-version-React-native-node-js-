const passport=require("passport");
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const User=require("../database/model/user").User;
const GOOGLE_CLIENT_ID="382961734743-bjmidrc70q8hvu7jgkrcfn7t1aq6p2fd.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET="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";


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/users/google/callback',
    passReqToCallback:true
  },async(req,accessToken,refreshToken,profile,cb)=>{
     const defaultUser={
        name:`${profile.name.givenName} ${profile.name.familyName}`,
        email:profile.emails[0].value,
        picture:profile.photos[0].value,
        GoogleId:profile.id,
     }
     const user=await User.findOrCreate({where:{GoogleId:profile.id},defaults:defaultUser}).catch((err)=>{
        console.log("Error signing up",err);
        cb(err,null);
     });

     // Vérifier le statut de l'utilisateur
     if (user && user[0] && user[0].status === 'blocked') {
      return cb(null, false, { message: "Vous êtes bloqué. Veuillez contacter l'administrateur pour plus d'informations." });
    }

     if(user && user[0]) return cb(null, user && user[0])
  }));
  //serialisation de l'utlisateur stocker ses info dans session 
  passport.serializeUser((user,cb)=>{
    console.log("serializing user :",user);
    cb(null,user.id);
  });
//deserialisation de l'utlisateur decoder ses info 
passport.deserializeUser(async(id,cb)=>{
    const user=await User.findOne({where:{id}}).catch((err)=>{
        console.log("Error deserializing",err);
        cb(err,null);
    });
    console.log("Deserialized user",user);
    if(user) cb(null,user);
})

