const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const houseSchema = new Schema({
  title: {
    type:String,
    required:[true,'Title is required']
  },
  description: {
    type:String,
  },
  cost:{
    type:Number,
  },
  location:{
    type:String,
  },
  ownerId:{ 
    type: Schema.Types.ObjectId, 
    ref: "User" 
    },
  reservations: [{ type: Schema.Types.ObjectId, ref: "Reservation" }],
});

module.exports = model("House", houseSchema);