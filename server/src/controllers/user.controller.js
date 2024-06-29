const User = require('../database/model/user').User; // Importer le modèle user
const Podcast =require('../database/model/podcast').Podcast;
const Track=require('../database/model/track').Track;
const Report =require('../database/model/reports').Report;
const bcrypt=require('bcrypt');
const { sign } = require('jsonwebtoken');
const {verify}=require("jsonwebtoken");
var nodemailer = require('nodemailer');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('evey', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});
// Route pour ajouter un client (*****register form*****)
async function add_User(req, res) {
  const { name, password, email } = req.body;

  try {
    // Verify if a user exists with these credentials
    const user = await User.findOne({
      where: { name: name, email: email },
    });

    if (user) {
      res.json({ error: "User already exists!" });
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: name,
        password: hashedPassword,
        email: email,
      });

      res.json({ message: "User registered!" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
}
//Route pour s'authentifier 

async function login_user(req, res) {
    const { name, password, email } = req.body;
    // Verify if a user exists with these credentials
    const user = await User.findOne({
      where: { name: name, email: email },
    });
    if (!user) {
      res.json({ error: "USER DOESN'T EXIST! TRY AN OTHER USERNAME AND EMAIL" });
    } else {
      const dbpassword = user.password;
      bcrypt.compare(password, dbpassword).then((match) => {
        if (!match) {
          res.json({ error: "Wrong password" });
        } else {
         

         const accesToken=sign( {name:user.name,id:user.id},"importantsecret",{expiresIn:"10h"});
    
          res.cookie("accesstoken",accesToken,{ httpOnly:true});   
            
         // res.json(accesToken);
          
          // Vérifier le rôle de l'utilisateur
          if (user.role === 'admin') {
            // Si l'utilisateur est un admin, rediriger vers la page Admin
            return res.status(200).json({ role: 'admin' });
          } else {
            // Sinon, rediriger vers la page utilisateur normale
            if (user.status === 'blocked') {
              return res.json({ errorblock: 'USER BLOCKED' });
            }
            
            else {  return res.status(200).json({ role: 'user'});}
           
          }
         
        }
      });
    }
    
  }


//route pour le profile 
async function get_profile(req, res, next) {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      // Si l'utilisateur n'a pas été trouvé, renvoyer une erreur 404
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    // Si une erreur se produit, renvoyer une réponse avec un statut 500 (Internal Server Error) et l'erreur
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
//Route pour logout 
function logout(req,res){
  res.clearCookie('accesstoken');
  res.clearCookie('connect.sid');    
  console.log("logout")
  res.redirect('http://localhost:3000/');
}
//Route pour forget password 
async function forget_password(req,res){
const {email}=req.body;
try{
  const oldUser=await User.findOne({
    where: { email: email },
  });
  if(!oldUser){
    return(res.json({status:"user didn't exist!!!!!!"}))
  }
  const secret ="importantsecret"+oldUser.password;
  const token=sign( {email:oldUser.email,id:oldUser.id},secret,{expiresIn:"10h"});
  const link=`http://localhost:5000/users/resetPassword/${oldUser.id}/${token}`;
//**************************************************************************************************** */
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eyaouniessect@gmail.com',
    pass: 'kfxomsixkcxqwrkb'
  }
});

var mailOptions = {
  from: 'eyaouniessect@gmail.com',
  to: 'bella.totaayouta@gmail.com',
  subject: 'Reset Password',
  text: link
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  console.log(link,12)
}catch(err){ console.log(err)}
}



//Route reset password **********************************
async function reset_password(req,res){
const {id,token}=req.params;
console.log(req.params,"parametre url");
const oldUser=await User.findOne({
  where: { id: id },
});
//res.send(token)
const secret ="importantsecret"+oldUser.password;

try {
  const Verify=verify(token,secret);
  // this is made by ejs but i don't wont to do it like that 
 
 res.redirect(`http://localhost:3000/resetPassword/${oldUser.id}/${token}`);

//res.send("verified")
} catch (error) {
  res.send("Not verified")
}

}

//Route reset password post
async function reset_password_post(req,res){
  const {id,token}=req.params;
  const {password}=req.body;
  console.log(req.params,"parametre url");
  const oldUser=await User.findOne({
    where: { id: id },
  });
  if(!oldUser){
    return(res.json({status:"user didn't exist!!!!!!"}))
  }
  console.log(oldUser.password)
  const secret ="importantsecret"+oldUser.password;
  try {
    const Verify=verify(token,secret);
    const encryptedPassword=await bcrypt.hash(password,10);
    User.update({ password: encryptedPassword }, { where: { id: id } })
  .then(resultat => {
    console.log(resultat);
  })
  .catch(erreur => {
    console.log(erreur);
  });
  res.json({status:"password Updated"})
  } catch (error) {
    res.send("something went wrong password not updated")
  }
  
  }
  
  

   // Définir une route pour supprimer un utilisateur
 async function  deleteUser (req, res)  {
  const userId = req.params.id;
   console.log(userId);
  // Commencer une transaction Sequelize pour assurer l'intégrité de la base de données
  const transaction = await sequelize.transaction();

  try {
    // Récupérer l'utilisateur à supprimer à partir de l'ID
    const userToDelete = await User.findByPk(userId);

    // Si l'utilisateur n'existe pas, renvoyer une erreur 404
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Récupérer toutes les podcasts associées à l'utilisateur à supprimer
    const podcastsToDelete = await Podcast.findAll({
      where: { userId: userToDelete.id },
      transaction, // Passer la transaction Sequelize
    });

    // Supprimer toutes les podcasts associées à l'utilisateur
    for (let i = 0; i < podcastsToDelete.length; i++) {
      const podcastToDelete = podcastsToDelete[i];

      // Récupérer tous les tracks associés à la podcast à supprimer
      const tracksToDelete = await Track.findAll({
        where: { podcastId: podcastToDelete.id },
        transaction, // Passer la transaction Sequelize
      });

      // Supprimer tous les tracks associés à la podcast
      await Track.destroy({
        where: { podcastId: podcastToDelete.id },
        transaction, // Passer la transaction Sequelize
      });

      // Supprimer la podcast
      await podcastToDelete.destroy({ transaction }); // Passer la transaction Sequelize
    }

    // Supprimer l'utilisateur
    await userToDelete.destroy({ transaction }); // Passer la transaction Sequelize

    // Valider la transaction Sequelize
    await transaction.commit();

    // Renvoyer une réponse avec un statut 204 (No Content)
    return res.status(204).send();
  } catch (error) {
    // Annuler la transaction Sequelize en cas d'erreur
    await transaction.rollback();

    // Renvoyer une réponse avec un statut 500 (Internal Server Error) et l'erreur
    return res.status(500).json({ error: error.message });
  }
  }


// Définir une route pour envoyer un e-mail de confirmation
 async function deleteAcount (req, res)  { 
  const userId = req.params.id;
  console.log(userId);

  // Commencer une transaction Sequelize pour assurer l'intégrité de la base de données
  const transaction = await sequelize.transaction();

  try {
    // Récupérer l'utilisateur à supprimer à partir de l'ID
    const userToDelete = await User.findByPk(userId);

    // Si l'utilisateur n'existe pas, renvoyer une erreur 404
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }
    
   //Generer un token pour s'assurer que l'utlisateur qui est entrain c'est bien l'utlisateur qui est entrain de supprimer son compte 
   const secret ="importantsecret"+userToDelete.password;
   const token=sign( {email:userToDelete.email,id:userToDelete.id},secret,{expiresIn:"10h"});
    // Envoyer un e-mail de confirmation à l'utilisateur
    const confirmationLink = `http://localhost:5000/users/confirm-user-deletion/${userId}?token=${token}`;
    const emailSent = await sendConfirmationEmail("bella.totaayouta@gmail.com", confirmationLink);
   // const emailSent = await sendConfirmationEmail(userToDelete.email, confirmationLink);
    if (!emailSent) {
      // En cas d'erreur lors de l'envoi de l'e-mail, renvoyer une erreur 500
      return res.status(500).json({ error: 'Error sending confirmation email' });
    }

    // Commit de la transaction Sequelize si l'e-mail est envoyé avec succès
    await transaction.commit();

    // Renvoyer une réponse avec un statut 200 (OK)
    return res.status(200).json({ message: 'Confirmation email sent' });

  } catch (error) {
    // Annuler la transaction Sequelize en cas d'erreur
    await transaction.rollback();

    // Renvoyer une réponse avec un statut 500 (Internal Server Error) et l'erreur
    return res.status(500).json({ error: error.message });
  }
};



// Fonction pour envoyer un e-mail de confirmation à l'utilisateur
async function sendConfirmationEmail(userEmail, confirmationLink) {
  try {
    // Créer un transporteur Nodemailer avec les informations de connexion 
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'eyaouniessect@gmail.com',
        pass: 'kfxomsixkcxqwrkb'
      }
    });

    // Définir les options d'e-mail
    const mailOptions = {
      from: 'eyaouniessect@gmail.com',
      to: userEmail,
      subject: 'Confirmation de suppression de compte',
      text: `Cliquez sur ce lien pour confirmer la suppression de votre compte : ${confirmationLink}`,
    };

    // Envoyer l'e-mail et attendre la réponse
    const info = await transporter.sendMail(mailOptions);

    console.log('Confirmation email sent: ' + info.response);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


// Définir une route pour confirmer la suppression d'un utilisateur
 async function confirmDeleteUser(req, res)  {
  const userId = req.params.id;
  const token = req.query.token;

  // Récupérer l'utilisateur à supprimer à partir de l'ID
  const userToDelete = await User.findByPk(userId);

  // Si l'utilisateur n'existe pas, renvoyer une erreur 404
  if (!userToDelete) {
   // return res.status(404).json({ error: 'User not found' });
   return res.redirect('http://localhost:3000');
  }

  // Vérifier que le jeton est valide pour l'utilisateur
  const secret ="importantsecret"+userToDelete.password;
  const Verify=verify(token,secret);
    // Supprimer tous les podcasts de l'utilisateur, ainsi que tous les tracks correspondants
    const podcastsToDelete = await Podcast.findAll({ where: { userId } });
    for (const podcast of podcastsToDelete) {
      await Track.destroy({ where: { podcastId: podcast.id } });
      await podcast.destroy();
    }
  // Supprimer l'utilisateur de la base de données
  try {
    await userToDelete.destroy();
     // Déconnecter l'utilisateur de toutes les sessions
      // Détruire la session actuelle de l'utilisateur
    req.session.destroy(() => {
      // Rediriger l'utilisateur vers la page d'accueil
      res.clearCookie('accesstoken');
      res.clearCookie('connect.sid'); 
      res.redirect('http://localhost:3000');
    });
  } catch (error) {
    // Renvoyer une réponse avec un statut 500 (Internal Server Error) et l'erreur
    return res.status(500).json({ error: error.message });
  }
};




//route update user name
 async function updateUserName (req, res)  {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.name = req.body.name;
    await user.save();

    return res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

//route update user Email
async function updateUserEmail (req, res)  {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.email = req.body.email;
    await user.save();

    return res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

//route pour mettre à jour son mot de passe 
 async function motdepasseMAJ (req, res)  {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    // Vérifier si le mot de passe actuel fourni correspond au mot de passe enregistré pour l'utilisateur
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password');
    }

    // Si le mot de passe actuel est valide, hasher et enregistrer le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.send('Password updated successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};
 async function countUsers (req, res)  {
  try {
    const count = await User.count();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//route qui recupere tous utlsateurs 
 async function getAllUsers (req, res)  {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
//route pour mettre à jour la colone num of podcasts 
 async function updateNumPodcasts(req, res)  {
  try {
    const users = await User.findAll();

    for (const user of users) {
      const numPodcasts = await Podcast.count({ where: { userId: user.id } });
      user.numPodcasts = numPodcasts;
      await user.save();
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating the number of podcasts');
  }
};

//route pour mettre à jour la colone alerts
async function updateNumAlerts(req, res)  {
  try {
    const podcasts = await Podcast.findAll();

    for (const user of users) {
      const alert = await Report.count({ where: { podcastId: podcast.id } });
      user.numPodcasts = numPodcasts;
      await user.save();
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while updating the number of podcasts');
  }
};


//route pour bloquer un utlisateur 
 async function blockUser (req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.status = 'blocked';
    await user.save();
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while blocking the user');
  }
};
//route pour debloquer un utlisateur 
 async function unblockUser (req, res)  {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.status = 'active';
    await user.save();
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while unblocking the user');
  }
};

async function update_alerts (req, res) {
  try {
    const result = await User.update(
      {
        alert: sequelize.literal(`(
          SELECT COUNT(*)
          FROM reports
          INNER JOIN podcasts ON reports.podcastId = podcasts.id
          WHERE podcasts.userId = users.id
        )`),
      },
      { where: {} } // Pass an empty object as the `where` parameter to update all users
    );
    res.status(200).json({ message: `Updated ${result[0]} users` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//route pour recumperer top5 podcasts 
 async function  getTopActiveUsers (req, res)  {
  try {
    const topUsers = await User.findAll({
      attributes: ['name', 'numPodcasts'],
      order: [['numPodcasts', 'DESC']],
      limit: 5,
      group: ['User.id']
    });
    res.json(topUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving top podcasts');
  }
};

module.exports = {
   add_User,login_user,get_profile,logout,forget_password,
   reset_password,reset_password_post,deleteUser,deleteAcount,
   confirmDeleteUser,updateUserName,updateUserEmail,motdepasseMAJ,
   countUsers,getAllUsers,updateNumPodcasts,blockUser,unblockUser,
   update_alerts,getTopActiveUsers
};
