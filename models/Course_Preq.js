const mongoose = require('mongoose')

const CPschema = new mongoose.Schema({
     Course_Code :{
            type: mongoose.Schema.Types.ObjectId, ref :'Course',
            required:true
     },
     Prerequisites : {
          type: mongoose.Schema.Types.ObjectId, ref :'Course',
            required:true
     }
})

const CPModel = mongoose.model('Course_preq',CPschema)
module.exports = CPModel