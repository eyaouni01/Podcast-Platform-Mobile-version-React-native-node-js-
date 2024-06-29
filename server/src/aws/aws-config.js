require('dotenv').config();
const AWS = require('aws-sdk');

const bucket_name = process.env.bucket_name;
const access_key = process.env.access_key;
const secret_access_key = process.env.secret_access_key;
const region = process.env.region;


const s3 = new AWS.S3({
  accessKeyId: access_key,
  secretAccessKey: secret_access_key,
  region: region
});

module.exports = s3;


/*
const params = {
  Bucket: bucket_name
};
s3.listObjects(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data.Contents);
  }
});
*/
