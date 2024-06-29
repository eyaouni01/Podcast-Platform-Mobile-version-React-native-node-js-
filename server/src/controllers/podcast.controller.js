const Podcast = require('../database/model/podcast').Podcast; // Importer le modèle Podcast
const Report =require("../database/model/reports").Report;
const { Op } = require('sequelize');
const Sequelize = require('sequelize');


const s3 = require('../aws/aws-config');
const fs = require('fs');
const rimraf = require('rimraf');


// Route pour récupérer tous les podcasts
/*async function getAllPodcasts(req, res) {
    try { 
      const podcasts = await Podcast.findAll();
      res.json(podcasts);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
}*/async function getAllPodcasts(req, res) {
  try { 
    const podcasts = await Podcast.findAll({ where: { status: 'active' } });
    res.json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
}

// Route pour récupérer 6 podcasts d'un topic
function getSixPodcastsByTopic(req, res) {
    const { topic } = req.params;

    Podcast.findAll({
        where: { topic,status: 'active' },
        limit: 6,
    })
    .then((result) => {
    res.send(result);
    })
    .catch((error) => {
    console.log(error);
    res.send(error);
    });
}
  
// Route pour récupérer tous les podcasts d'un topic
function getAllPodcastsByTopic(req, res) {
const { topic } = req.params;

Podcast.findAll({
    where: { topic },
})
    .then((result) => {
    res.send(result);
    })
    .catch((error) => {
    console.log(error);
    res.send(error);
    });
}
  
// Route pour récupérer un podcast d'un id donnée
async function getPodcastById(req, res) {
  const podcastId = req.params.podcast_id;
  try {
  const podcastData = await Podcast.findOne({ where: { id: podcastId, status: { [Op.ne]: 'blocked' } } });
  if (!podcastData) {
  throw new Error(`Podcast with id ${podcastId} not found or is blocked`);
  }
  res.json(podcastData);
  } catch (err) {
  console.error(err);
  res.status(500).send('Une erreur est survenue lors de la récupération du podcast.');
  }
  }
  
// Route pour recherche des podcasts selon le nom ou l'auteur
async function searchPodcasts(req, res) {
  const searchQuery = req.params.searchTerm;
  const podcasts = await Podcast.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { title: { [Op.like]: `%${searchQuery}%` } },
            { author: { [Op.like]: `%${searchQuery}%` } },
          ],
        },
        { status: { [Op.ne]: 'blocked' } }, // Exclure les podcasts bloqués
      ],
    },
  });
  res.json(podcasts);
}


//création d'un podcast
async function postPodcast(req, res) {
  const { title, description, author, topic, imageUrl } = req.body;
  try {
    const newPodcast = await Podcast.create({
      title,
      description,
      author,   
      topic,
      imageUrl
    });
    res.json(newPodcast);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
}


// route exportation et importation d'une image vers aws s3
async function postImagePodcast(req, res) {
  try {
    const fileContent = fs.readFileSync(req.file.path);

    const params = {
      Bucket: "evey-podcasts",
      Key: 'podcast_images/' + Date.now() + '-' + req.file.originalname,
      Body: fileContent,
      ACL: 'public-read',
    };

    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);

    // envoi l'URL du fichier téléchargé à votre interface React
    res.send({ url: data.Location });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
/*
    // Supprime le dossier temporaire de Multer
    rimraf(req.file.path, (err) => {
      if (err) console.error(err);
      console.log(`File removed from temporary storage. ${req.file.path}`);
    });*/
}

//route pour stocker nb de vue pour un podcast 
async function countView (req, res) {
  try {
   // const podcast = await Podcast.findById(req.params.id);
     podcast=await  Podcast.findOne({ where: { id: req.params.id } });
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    podcast.views += 1;
    await podcast.save();
    console.log("sucesssssssss view")
    res.status(200).json({ message: 'View count incremented successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error !!!!' });
  }
};
//route pour la recherche avancee 


// Route pour récupérer les résultats de recherche en fonction des filtres de date et de thème
 async function getSearchPodcast(req, res)  {
  const { dateFilter, themeFilter } = req.params;
  console.log(dateFilter,"datafilter*");
  console.log(themeFilter,"themeFilter*");
  let startDate = '';
 
  // Calculer la date de début et la date de fin en fonction du filtre de date sélectionné
  switch (dateFilter) {
    case 'last_day':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      break;
    case 'one_week':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'one_month':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'one_year':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
  }

  // Construire la requête Sequelize pour récupérer les résultats en fonction des filtres de date et de thème
  let whereClause = { created_at: { [Sequelize.Op.gte]: startDate },status: { [Sequelize.Op.ne]: 'blocked' }  };
  if (themeFilter) {
    whereClause.topic = themeFilter;
  }
  const results = await Podcast.findAll({ where: whereClause });

  res.send(results);
};


//route de recuperation de donnees avec pagination 


// route pour la pagination des podcasts
async function getdata(req, res)  {
  const {  topic } = req.query;
  console.log(topic);
  const limit = req.query.limit ? parseInt(req.query.limit) : 3;
const offset = req.query.offset ? parseInt(req.query.offset) : 1;
console.log(offset,"this is offset value")
  const where = topic ? { topic: topic ,status: { [Sequelize.Op.ne]: 'blocked' } } : {};
  const podcasts = await Podcast.findAll({
    where: where,
    limit: limit,
    offset: offset,
    order: [['created_at', 'DESC']]
  });
  const data = podcasts.map(podcast => ({
    id: podcast.id,
    title: podcast.title,
    author:podcast.author,
    description: podcast.description,
    imageUrl:podcast.imageUrl
    // Ajouter d'autres propriétés ici si nécessaire
  }));

  console.log("total des podcasts", data.length);
  res.json({ data });
};
//route pour compter le nombre de podcast 
async function countPodcasts (req, res)  {
  try {
    const count = await Podcast.count();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//route pour bloquer un podcast

async function handleBlock(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  console.log(status,"new status ");
  try {
    const podcasts = await Report.findAll({ where: { podcastId: id } });
    const podcast1 = await Podcast.findByPk(id); 
    if (!podcasts || podcasts.length === 0) {
      throw new Error(`Podcast with id ${id} not found in report table`);
    }

    podcast1.status = status;
  
    await podcast1.save();
    console.log(`Podcast ${id} updated with status ${status}`);

    // save status to all reports associated with the podcast
    for (let i = 0; i < podcasts.length; i++) {
      const podcast = podcasts[i];
      podcast.status = status;
      await podcast.save();
    }

    res.status(200).json(podcasts);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: `Error updating podcast with id ${id}` });
  }
}

//route pour recuperer most viewd podcasts 
async function  getMostViewdPodcaasts (req, res)  {
  try {
    const topPodcasts = await Podcast.findAll({
      attributes: ['title', 'views'],
      order: [['views', 'DESC']],
      limit: 5,
      group: ['Podcast.id']
    });
    res.json(topPodcasts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving top podcasts');
  }
};

module.exports = {
    getAllPodcasts,
    getSixPodcastsByTopic,
    getAllPodcastsByTopic,
    getPodcastById,
    searchPodcasts,
    postPodcast,
    postImagePodcast,
    countView,
    getSearchPodcast,
    getdata,//fonction de pagination
    countPodcasts,
    handleBlock,
    getMostViewdPodcaasts
};