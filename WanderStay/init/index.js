const mongoose = require ("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js") 

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("Connected to db")
})
.catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(mongo_url);
}


const initDB = async () => {
    await Listing.deleteMany({});   //FIRSTLY CLEARS ALL EXISTING DATA 
    await Listing.insertMany(initData.data);  //INSERT THE DATA FROM DATA.JS FILE //WHY .data? => as there is an object in file so we excess it by accessing the key ...
    console.log("data was initialized");
  };
  
initDB();
  