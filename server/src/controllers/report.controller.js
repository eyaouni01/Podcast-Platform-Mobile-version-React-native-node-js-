const Report = require('../database/model/reports').Report; // Importer le modèle Podcast
const { Op } = require('sequelize');
const sequelize = require('sequelize');
// POST route pour enregistrer un signalement de podcast
async function add_Report(req, res) {
    const { podcastId, reason , title,author } = req.body;
    
    // Parse le podcastId en entier
    const parsedPodcastId = parseInt(podcastId);
  
    // Vérifie si le parsedPodcastId est un entier valide
    if (isNaN(parsedPodcastId)) {
      return res.status(400).json({ message: 'Invalid podcastId format' });
    }
    
    try {
      const reportedPodcast = await Report.create({
        podcastId: parsedPodcastId,
        reason,title,author
      });
      res.status(201).json(reportedPodcast);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  //route qui envoi les podcasts signalees 
   async function get_Reports (req, res)  {
    try {
        const reportedPodcasts = await Report.findAll({
            attributes: ['id',"reason", 'title', 'author', 'createdAt',"status","podcastId"]
          });
      res.json(reportedPodcasts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }; 
  module.exports = {
   add_Report,get_Reports
};
  