const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: 'AKIAQ54I6KM56BKE4QFK',
  secretAccessKey: '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',
  region: 'eu-west-3',
});

const file = './podcast_image.jpeg'; // Le chemin du fichier que vous voulez télécharger

const fileStream = fs.createReadStream(file);

const params = {
  Bucket: 'evey-podcasts',
  Key: 'podcast_images/' + Date.now() + '-' + path.basename(file),
  Body: fileStream,
};

s3.upload(params, function(err, data) {
  if (err) {
    console.log('Error uploading file: ', err);
  } else {
    console.log(`File uploaded successfully. ${data.Location}`);
    // Afficher l'URL de l'image dans votre application React
  }
});
