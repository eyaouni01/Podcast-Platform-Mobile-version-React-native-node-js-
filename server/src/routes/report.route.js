const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
//route pour enregistrer un signalement 
router.post('/report-podcast',reportController.add_Report);
//route pour envoyer tous les podcasts signalés
 
router.get('/reported_podcasts',reportController.get_Reports);

module.exports = router;