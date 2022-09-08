require('dotenv').config()
const AWS = require('aws-sdk');
// const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

AWS.config.loadFromPath('./aws-config.json');

const bucketName = 'bucket-7664gg';
const region = AWS.config.region;
const s3 = new AWS.S3({});


// Upload file to S3 bucket

function uploadFile(fileName, filePath) {
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: fileName
    };

    return s3.upload(uploadParams).promise();
}

function getFile(fileName) {
    const downloadParams = {
        Key: fileName,
        Bucket: bucketName,
    };
    const url = s3.getSignedUrl('getObject', downloadParams);
    return url;
}

exports.uploadFile = uploadFile;
exports.getFile = getFile;