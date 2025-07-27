const mongoose = require('mongoose');

const CDSchema = new mongoose.Schema({
  Course_Code: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // ربط بـ Course
 
  Department: { type: mongoose.Schema.Types.ObjectId, ref: 'Depart' }, // ربط بـ Depart
  Required: { type: Boolean, required: true }
});

const CDModule = mongoose.model('course_Depart', CDSchema);
module.exports = CDModule;