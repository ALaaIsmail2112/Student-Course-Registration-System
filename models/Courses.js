const mongoose =  require('mongoose')
const CourseSchema = new mongoose.Schema({
     Course_Code: { type: "String", required: true }, 
     Course_Name: { type: "String", required: true }, 
     Category: { type: "String", required: true },
     Credits: { type: "String", required: true }, 
     level: { type: "String", required: true },
     
     
})

const CourseModel = mongoose.model('Course',CourseSchema)
module.exports = CourseModel