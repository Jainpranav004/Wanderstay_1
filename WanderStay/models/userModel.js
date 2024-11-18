const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },  
  
  email:{
        type: String,
        required: true,
    }
   
})

userSchema.add({ password: String });


//WE NEED TO DEFINE PASSWORD IN SCHEMA AS IT IS ALREADY DONE BY PASSPORT  (hashing .salting is also done)
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);