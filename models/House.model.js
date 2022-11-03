const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const houseSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
  },
  imageUrl: String,
  cost: {
    type: Number,
  },
  location: {
    type: String,
  },
  guests: {
    type: Number,
  },
  bedroom: {
    type: Number,
  },
  bed: {
    type: Number,
  },
  bath: {
    type: Number,
  },
  offers: { basicOffers: [String] },
  comments: [String],
  likes: { type: Number, default: 0 },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reservations: [{ type: Schema.Types.ObjectId, ref: "Reservation" }],
});

module.exports = model("House", houseSchema);
