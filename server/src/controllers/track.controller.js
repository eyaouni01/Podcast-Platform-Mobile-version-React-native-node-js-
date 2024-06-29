const Track = require('../database/model/track').Track; // Importer le modèle Track
const s3 = require('../aws/aws-config');
const fs = require('fs');

// Route pour récupérer tous les tracks d'un podcast cliqué 
async function getAllTracks(req, res) {
    try {
      const tracks = await Track.findAll();
      res.json(tracks);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
}

// création d'un track pour un podcast
async function postTrack(req, res, next) {
  const podcastId = parseInt(req.params.podcastId);
  if (isNaN(podcastId)) {
    return res.status(400).send('Invalid podcastId');
  }
  const { title, description } = req.body;
  try {
    // envoi du fichier vers AWS S3
    const fileStream = fs.createReadStream(req.file.path);
    const params = {
      Bucket: "evey-podcasts",
      Key: 'tracks_audio/' + Date.now() + '-' + req.file.originalname,
      Body: fileStream,
      ACL: 'public-read',
    };
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully. ${data.Location}`);

    // création du nouveau track dans la base de données
    const newTrack = await Track.create({
      title,
      description,
      podcastId,
      trackUrl: data.Location, // utilisation de l'URL retournée par AWS S3
    });
    res.json(newTrack);
  } catch (err) {
    next(err);
  }
}
//temps moyen d'un track 
async function updateTimeListened (req, res)  {
  const { trackId, listeningTime } = req.body;
  console.log(trackId);
  console.log(listeningTime);
  try {
      const track=await Track.findOne({ where: { id: trackId } });
      
      if (!track) {
          return res.status(404).send('Track not found');
      }
      const newNbView = track.nbView + 1;
      const newListeningTime = ((track.listeningTime * track.nbView  + parseFloat(listeningTime)) / newNbView).toFixed(2);;
     // const newListeningTime = (track.listeningTime * track.nbView + listeningTime) / newNbView;
      await track.update({
          nbView: newNbView,
          listeningTime: newListeningTime
      });
      res.send('Listening time saved');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
  }
};
//route pour recuperer un track donnee avec son id 

async function getTrackById(req, res) {
  const trackId = req.params.track_id;
  
  try {
    const trackData = await Track.findOne({ where: { id: trackId } });
    res.json(trackData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Une erreur est survenue lors de la récupération du podcast.');
  }
}
//route pour compter le nombre de track 
//route pour compter le nombre de podcast 
async function countTracks (req, res)  {
  try {
    const count = await Track.count();
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    getAllTracks,
    postTrack,
    updateTimeListened,getTrackById, countTracks
};