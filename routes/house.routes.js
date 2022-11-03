const router = require("express").Router();
const mongoose = require("mongoose");

const House = require("../models/House.model");
const Reservation = require("../models/Reservation.model");

const fileUploader = require("../config/cloudinary.config");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const attachCurrentUser = require("../middleware/attachCurrentUser");

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});

// POST /api/houses  -  Creates a new house
router.post("/houses", isAuthenticated, attachCurrentUser, (req, res, next) => {
  const {
    title,
    description,
    imageUrl,
    cost,
    location,
    guests,
    bedroom,
    bed,
    bath,
    offers,
  } = req.body;

  const newHouse = {
    title,
    description,
    imageUrl,
    cost,
    location,
    guests,
    bedroom,
    bed,
    bath,
    offers,
    ownerId: req.currentUser._id,
    reservations: [],
  };

  if (!title) {
    return res.status(400).json({ message: "Please provide the title" });
  }

  House.create(newHouse)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("error creating a new house...", err);
      res.status(500).json({
        message: "error creating a new house",
        error: err,
      });
    });
});

// GET /api/houses  -  Get list of houses
router.get("/houses", (req, res, next) => {
  House.find()
    .populate("reservations")
    .then((allHouses) => res.json(allHouses))
    .catch((err) => {
      console.log("error getting list of houses...", err);
      res.status(500).json({
        message: "error getting list of houses",
        error: err,
      });
    });
});

// GET /api/my-houses  -  Get list of my houses_
router.get(
  "/my-houses",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    House.find({ ownerId: req.currentUser._id })
      .populate("reservations")
      .then((allHouses) => res.json(allHouses))
      .catch((err) => {
        console.log("error getting list of houses...", err);
        res.status(500).json({
          message: "error getting list of houses",
          error: err,
        });
      });
  }
);

//  GET /api/houses/:houseId -  Retrieves a specific house by id
router.get("/houses/:houseId", (req, res, next) => {
  const { houseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(houseId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  House.findById(houseId)
    .populate("reservations")
    .then((house) => res.status(200).json(house))
    .catch((err) => {
      console.log("error getting a house details...", err);
      res.status(500).json({
        message: "error getting a house details",
        error: err,
      });
    });
});

//  POST /api/houses/:houseId -  Add comments to house by id
router.post(
  "/houses/:houseId",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { comment, numberOfLikes, houseId } = req.body;

    House.findByIdAndUpdate(houseId, {
      $push: { comments: comment },
      likes: numberOfLikes,
    })
      .then((response) => res.json(response))
      .catch((err) => {
        console.log("error creating a new reservation...", err);
        res.status(500).json({
          message: "error creating a new reservation",
          error: err,
        });
      });
  }
);

// PUT  /api/houses/:houseId  -  Updates a specific house by id
router.put(
  "/houses/:houseId",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { houseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(houseId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    House.findById(req.params.houseId)
      .then((houseDetails) => {
        if (
          req.currentUser._id &&
          req.currentUser._id.equals(houseDetails.ownerId)
        ) {
          House.findByIdAndUpdate(houseId, req.body, { new: true })
            .then((updatedHouse) => {
              res.json(updatedHouse);
            })
            .catch((err) => {
              console.log("error updating a house...", err);
              res.status(500).json({
                message: "error updating a house",
                error: err,
              });
            });
        } else {
          res.status(400).json({
            message:
              "Users can updated only thier own data.Please Check the data you are updating!",
          });
          return;
        }
      })
      .catch((err) => {
        console.log("error getting house details from DB", err);
        next();
      });
  }
);

// DELETE  /api/houses/:houseId  -  Deletes a specific house by id
router.delete(
  "/houses/:houseId",
  isAuthenticated,
  attachCurrentUser,
  (req, res, next) => {
    const { houseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(houseId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    House.findById(req.params.houseId)
      .then((houseDetails) => {
        if (
          req.currentUser._id &&
          req.currentUser._id.equals(houseDetails.ownerId)
        ) {
          House.findByIdAndRemove(houseId)
            .then(() =>
              res.json({
                message: `House with ${houseId} is removed successfully.`,
              })
            )
            .catch((err) => {
              console.log("error deleting a house...", err);
              res.status(500).json({
                message: "error deleting a house",
                error: err,
              });
            });
        } else {
          res.status(400).json({
            message:
              "Users can delete only thier own data.Please Check the data you are deleting!",
          });
          return;
        }
      })
      .catch((err) => {
        console.log("error deleting house details from DB", err);
        next();
      });
  }
);

module.exports = router;
