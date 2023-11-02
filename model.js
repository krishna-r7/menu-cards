const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
 
  username:String,
  email: String, 
  password:String,
  usertype:Number,
  // status:Number

},  {
  collection: 'user' 
});

const menuSchema = new mongoose.Schema({
 
  cname:String,
  subcname: String, 
 
});

const foodSchema2 = new mongoose.Schema({
  
  desc: String,
  
});

const foodSchema1 = new mongoose.Schema({
  category: String,
  
  item2: [foodSchema2],
  
});

const foodSchema = new mongoose.Schema({
  // name: String,
 
  region:String,
  item1: [foodSchema1],
});



const fullSchema = new mongoose.Schema({
  foodname: String,
  item: [foodSchema], // This represents a nested array of books
});

const Menu = mongoose.model('menu', fullSchema);




const Data = mongoose.model('user', dataSchema);
const Library = mongoose.model('menus', menuSchema);

module.exports = {Data,Menu,Library}