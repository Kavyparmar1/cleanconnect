const mongoose = require('mongoose')

async function connectDb() {
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
          console.log('connect the db')
    })
    .catch((err)=>{
         console.log('disconnect db',err);
         
    })
}

module.exports = connectDb