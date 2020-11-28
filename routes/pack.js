const express = require ('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'temp/'});

const User = require('../models/user');
const Sound = require('../models/sound');
const Pack = require('../models/pack');
const Collection = require('../models/collection');
const { s3upload } = require('../models/s3-upload');

// AWS SETUP
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
  });
  
const s3 = new AWS.S3();

// ROUTES

router.get('/', (req, res, next) => {
    res.send("pack get route");
});


// POST PACK
router.post('/', upload.fields([{name: 'image', maxCount: 1},{name: 'preview', maxCount: 1}]), (req, res, next) => {
    const {name, author, description } = req.body;
    const { image, preview } = req.files;
    
    // Upload and return s3 items
    const imageUpload = new Promise((resolve, reject) => {
        s3.upload({
          Bucket: process.env.IMAGESBUCKET,
          Body: fs.createReadStream(image[0].path),
          Key: image[0].originalname,
          ACL: 'public-read' // Make this object public
        }, (err, data) => err == null ? resolve(data.Location) : reject(err));
      });

    const previewUpload = new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.SOUNDSBUCKET,
            Body: fs.createReadStream(preview[0].path),
            Key: preview[0].originalname,
            ACL: 'public-read' // Make this object public
        }, (err, data) => err == null ? resolve(data.Location) : reject(err));
    });

    // Create Mongo Pack item after Promises are resolved

    Promise.all([imageUpload, previewUpload]).then((values) => {
        const pack = new Pack({
            name: name,
            // author: author,
            image: values[0],
            description: description,
            sounds: [],
            preview: values[1]
        })

        // remove files
        fs.unlink(image[0].path);
        fs.unlink(preview[0].path);

        // save to database
        pack.save()
            .then(() => {
                res.status(201).send("Pack created successfully");
            })
            .catch((err) => {
                res.status(400).send(err);
            });
    })
    .catch((err) => console.log(err));

});



router.delete('/:id', (req, res, next) => {
    res.send("pack delete route");
});


module.exports = router;