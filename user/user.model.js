const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Types;

const usersSchema = new Schema ({ 
  email: {
    type: String,
    required: true,
    validate: (value) => value.includes('@'),
    unique: true,
  },
  password: {
   type: String,
   required: true
},
  subscription: {
   type: String,
   enum: ["free", "pro", "premium"],
   default: "free"
},
token: String
});

const userModel = mongoose.model("Auth", usersSchema);
module.exports = userModel;