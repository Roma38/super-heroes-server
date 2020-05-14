var express = require("express");
var router = express.Router();
var Hero = require("../models/hero");
var multer = require("multer");

//multer setup
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  }
});

var upload = multer({
  storage,
  limits: {
    fileSize: 5e6
  }
}).array("images[]");

// Get heroes
router.get("/", function (req, res, next) {
  Hero.find()
    .then(heroes => res.status(201).json(heroes))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error });//TODO: status code
    });
});

// Add hero
router.post("/", function (req, res, next) {
  upload(req, res, function (err) {
    //TODO: handle errors
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }
    // Everything went fine.

    const { nickname, realName, description, superPowers, catchPhrase } = JSON.parse(req.body.hero);
    const hero = new Hero({
      nickname, realName, description, superPowers, catchPhrase,
      images: req.files ? req.files.map(({ filename }) => filename) : []
    });

    hero
      .save()
      .then(hero => res.status(201).json(hero))
      .catch(error => {
        if (error.code === 11000) {
          res
            .status(422)
            .json({ error: "Hero with such name already exists" });
        }
        console.error(error);
        res.status(500).json(error);//TODO: status code
      });
  });
});

//Edit hero
router.put("/", function (req, res, next) {
  upload(req, res, function (err) {
    //TODO: handle errors
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }
    // Everything went fine.

    const { _id, nickname, realName, description, superPowers, catchPhrase, images } = JSON.parse(req.body.hero);

    const newHero = {
      nickname, realName, description, superPowers, catchPhrase,
      images: req.files ? images.concat(req.files.map(({ filename }) => filename)) : images
    };

    Hero.findByIdAndUpdate(_id, newHero)
      .then(({ _id }) => res.status(201).json({ ...newHero, _id }))
      .catch(error => {
        if (error.code === 11000) {
          res
            .status(422)
            .json({ error: "Hero with such name already exists" });
        }
        console.error(error);
        res.status(500).json(error);//TODO: status code
      });
  });
});

//Delete hero
router.delete("/", multer().none(), function (req, res, next) {
  Hero.findByIdAndDelete(req.body._id)
    .then(() => res.status(200).json({ message: "Successfully deleted" }))
    .catch(error => {
      console.error(error);
      res.status(500).json(error); //TODO: status code
    });
  res.status(200).json(req.body);
});

module.exports = router;
