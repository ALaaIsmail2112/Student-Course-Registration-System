 const mongoose =  require('mongoose')

const StudenSchema = new mongoose.Schema({
     code : {type:"String", required:true},
     name : {type:"String" , required :true},
     email :  {type:"String", required :true },
     depart_id : {type: mongoose.Schema.Types.ObjectId, ref :'Depart'},
     gpa : {type:Number , required:true},
     level : {type:Number , required:true},
     semester : {type:Number , required:true},
    
})

const StudentModel = mongoose.model('student',StudenSchema)
module.exports = StudentModel