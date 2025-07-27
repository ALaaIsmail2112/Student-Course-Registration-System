const mongoose =  require('mongoose')

const DepartSchema = new mongoose.Schema({
     depart_id:{type:Number , required:true},
     Name :{
          type:'String',
          required :true
     }

})



const DepartModule = mongoose.model('Depart',DepartSchema)
module.exports = DepartModule


// const depart = new DepartModule({
//      depart_id: 5, // قيمة `Pre_id`
//      Name: "MM" // قيمة `course_id` (يجب أن تكون ObjectId صالحًا)
//    });
   
//    depart.save()
//      .then(() => console.log("Pre-course saved successfully"))
//      .catch(err => console.error("Error saving pre-course", err));