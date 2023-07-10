const mongoose = require('mongoose');
const DB = process.env.DB;
mongoose.connect(DB,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("connection succesfully"))
.catch((err)=>console.log(err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
