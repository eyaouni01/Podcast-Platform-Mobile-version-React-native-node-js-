const {verify}=require("jsonwebtoken");
const User=require("../database/model/user").User;
const validateToken = async (req,res,next)=>{
   //utlisateur est connecte avec Google
   if(req.user){ return next();}

   //sinon si l'utlisateur est connecte avec JWT 
     else{


   const accesToken=req.cookies["accesstoken"];
   //const accessToken=req.cookies["access-token"];
   console.log(accesToken,12); 
   //l'utlisateur est ni connecte via google ni via jwt
   if(!accesToken) return res.json({error:"User not logged in !!"});

    try{
        const validToken=verify(accesToken,"importantsecret");

        if (validToken)

         {//req.user = await User.findByPk(validToken.id);
            console.log(validToken.id,122);
            req.user=await User.findOne({where: { id: validToken.id} });
            console.log(req.user,13);
            return next();}
    }catch(err){

       return res.status(400).json({error:err})
    }
     }
};
module.exports={validateToken};