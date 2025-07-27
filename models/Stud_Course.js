const mongoose = require('mongoose')

const SCSChema = new mongoose.Schema({
     Stud_code :{
            type: mongoose.Schema.Types.ObjectId, ref :'student',
            required:true
     },
     Coures_code : {
          type: mongoose.Schema.Types.ObjectId, ref :'Course',
            required:true
     },
     Course_Grade :{type:"String"},
     Semester : {type :Number}
})

const SCModel = mongoose.model('Student_Course',SCSChema)
module.exports = SCModel