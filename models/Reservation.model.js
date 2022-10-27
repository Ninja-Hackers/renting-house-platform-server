const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
  checkIn: {
    type:Date,
    required:[true,'Check-in date is required']
  },
  checkOut: {
    type:Date,
    required:[true,'Check-out date is required']
  },
  numberOfGuests:{
    type:Number,
    required:[true,'Number of guests is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  house: { type: Schema.Types.ObjectId, ref: "House" }
});

module.exports = model("Reservation", reservationSchema);