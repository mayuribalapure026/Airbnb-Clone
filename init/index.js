const mongoose = require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>console.log("Connected to Db"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}
const initDB=async(req,res)=>{
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"667ab4069f85b3d0929588d5"}));
  await Listing.insertMany(initData.data);
  console.log("Data Saved Successfully");
}
initDB();