const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// تعريف الموديلات كمتغيرات عامة
let studentModel, courseModel, registeredModel, course_Depart_Model, Course_Preq;

// 1. الاتصال بـ MongoDB Online وتعريف الموديلات
async function initializeDB() {
  try {
    await mongoose.connect('mongodb+srv://alaaismailmohamed1444:30DWQZUlhw1gJ8JV@cluster0.vgksc4d.mongodb.net/MyTeamApp?retryWrites=true&w=majority');
    console.log('✅ Successfully connected to MongoDB Online');

    // تعريف الموديلات بعد الاتصال الناجح
    studentModel = mongoose.model('students', new mongoose.Schema({}, { strict: false }));
    courseModel = mongoose.model('courses', new mongoose.Schema({}, { strict: false }));
    registeredModel = mongoose.model('student_courses', new mongoose.Schema({}, { strict: false }));
    course_Depart_Model = mongoose.model('course_departs', new mongoose.Schema({}, { strict: false }));
    Course_Preq = mongoose.model('course_preqs', new mongoose.Schema({}, { strict: false }));

    // اختبار الاتصال
    const count = await course_Depart_Model.countDocuments();
    console.log(`📊 Number of documents in course_departs: ${count}`);
    
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

// تنفيذ تهيئة قاعدة البيانات مباشرة
initializeDB();



// registeration 
router.get("/login", (req, res) => {
    res.render('../Views/Login/login.ejs')
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await studentModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "error" });
        }
        
        // 2. مقارنة كلمة المرور مباشرة (بدون bcrypt)
        if (password !== user.password) {
            return res.status(401).json({ error: "error" });
        }
        // 3. تخزين بيانات المستخدم في الجلسة
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };
                // 4. إرسال الاستجابة
        return res.redirect('/Callings/register')
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "   login error " });
    }
});


// دالة لجلب المواد الإجبارية والاختيارية بناءً على المعرف
async function getDepartmentCourses(departmentId) {
    const departmentCourses = await course_Depart_Model.find({
        department_id: new mongoose.Types.ObjectId(departmentId) // التأكد من تحويل الـ `departmentId` إلى ObjectId
    }).exec();

    console.log("departmentCoursesيثبقلفا", departmentCourses);

    const mandatoryCourses = departmentCourses
        .filter((course) => course.required === true)
        .map((course) => course.course_id);

        console.log("mandatoryCourses", mandatoryCourses);

    const optionalCourses = departmentCourses
        .filter((course) => course.required === false)
        .map((course) => course.course_id);

        console.log("optionalCourses", optionalCourses);

    return { mandatoryCourses, optionalCourses };
}

// دالة لجلب الكورسات المسجلة للطالب
async function getStudentCourses(studentId) {
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const registeredCourses = await registeredModel.find({ Stud_code: studentObjectId }).exec();
    return registeredCourses.map((course) => course.Coures_code);
}

// دالة لجلب المتطلبات المسبقة للمادة
async function getCoursePrerequisites(courseId) {
    const prerequisites = await Course_Preq.find({ Course_Code: courseId }).exec();
    return prerequisites.map(prereq => prereq.Prerequisites);
}

// دالة رئيسية لتسجيل الطالب
async function registerStudent(
    studentId,
    maxHoursPerTerm,
    minHoursPerTerm,
    requiredHours
) {
    try {
        // جلب بيانات الطالب
        console.log('studentId', studentId)
        const allstudent =  studentModel.find()
        console.log('allstudent' , allstudent)
        const student = await studentModel.findById(studentId).exec();
        if (!student) {
            throw new Error('الطالب غير موجود');
        }
        const { level: studentLevel, gpa: studentGPA, depart_id: studentDepartment , code: code , name:stsname } = student;
        console.log('student' , student.depart_id)

        // جلب الكورسات المسجلة للطالب
        const studentCourses = await getStudentCourses(studentId);

        // جلب جميع المواد من قاعدة البيانات
        const allCourses = await courseModel.find({}).exec();

        // جلب المواد الإجبارية والاختيارية للقسم
        const { mandatoryCourses, optionalCourses } = await getDepartmentCourses(studentDepartment);

        // حساب الساعات المكتملة لكل فئة ونوعها
        const completedHours = {
            General: { mandatory: 0, optional: 0 },
            College: { mandatory: 0, optional: 0 },
            Major: { mandatory: 0, optional: 0 },
            Project: { mandatory: 0, optional: 0 }
        };

        for (const courseId of studentCourses) {
            const courseCode = new mongoose.Types.ObjectId(courseId);
            const course = await courseModel.findOne({ _id: courseCode }).exec();

            if (course) {
                const credits = Number(course.Credits);
                const isMandatory = mandatoryCourses.some(id => id.equals(courseCode));
                const isOptional = optionalCourses.some(id => id.equals(courseCode));

                if (course.Category === 'General') {
                    if (isMandatory) completedHours.General.mandatory += credits;
                    else if (isOptional) completedHours.General.optional += credits;
                } 
                else if (course.Category === 'College') {
                    if (isMandatory) completedHours.College.mandatory += credits;
                    else if (isOptional) completedHours.College.optional += credits;
                }
                else if (course.Category === 'Major') {
                    if (isMandatory) completedHours.Major.mandatory += credits;
                    else if (isOptional) completedHours.Major.optional += credits;
                }
                else if (course.Category === 'Project') {
                    if (isMandatory) completedHours.Project.mandatory += credits;
                    else if (isOptional) completedHours.Project.optional += credits;
                }
            }
        }

        // حساب الساعات المتبقية لكل فئة
        const remainingHours = {
            General: {
                mandatory: Math.max(0, requiredHours.General.mandatory - completedHours.General.mandatory),
                optional: Math.max(0, requiredHours.General.optional - completedHours.General.optional)
            },
            College: {
                mandatory: Math.max(0, requiredHours.College.mandatory - completedHours.College.mandatory),
                optional: Math.max(0, requiredHours.College.optional - completedHours.College.optional)
            },
            Major: {
                mandatory: Math.max(0, requiredHours.Major.mandatory - completedHours.Major.mandatory),
                optional: Math.max(0, requiredHours.Major.optional - completedHours.Major.optional)
            },
            Project: {
                mandatory: Math.max(0, requiredHours.Project.mandatory - completedHours.Project.mandatory),
                optional: Math.max(0, requiredHours.Project.optional - completedHours.Project.optional)
            }
        };

        // المواد المؤهلة للتسجيل
        const eligibleCourses = {
            General: { mandatory: [], optional: [] },
            College: { mandatory: [], optional: [] },
            Major: { mandatory: [], optional: [] },
            Project: { mandatory: [], optional: [] }
        };

        for (const course of allCourses) {
            // 1. تحقق من المتطلبات المسبقة
            let prerequisitesMet = true;
            const prerequisites = await getCoursePrerequisites(course._id);

            if (prerequisites.length > 0) {
                for (const prereq of prerequisites) {
                    if (!studentCourses.some(id => id.equals(prereq))) {
                        prerequisitesMet = false;
                        break;
                    }
                }
            }

            if (!prerequisitesMet) continue;

            // 2. تحقق أن الطالب لم يسجل المادة من قبل
            const courseObjectId = new mongoose.Types.ObjectId(course._id);
            console.log('courseObjectId' , courseObjectId)
            if (studentCourses.some(id => id.equals(courseObjectId))) continue;

            // 3. قيود الـ GPA
            if (studentGPA < 2.0 && course.Credits > 12) continue;

            // 4. تحقق من مستوى المادة
            if (course.level > studentLevel) continue;

            // 5. تحديد نوع المادة (إجباري/اختياري) والفئة
            const isMandatory = mandatoryCourses.some(id => id.equals(courseObjectId));
            const isOptional = optionalCourses.some(id => id.equals(courseObjectId));
            const category = course.Category;

            // 6. إضافة المادة إلى القائمة المناسبة إذا كانت هناك حاجة لساعات
            if (isMandatory) {
                if (remainingHours[category].mandatory > 0) {
                    eligibleCourses[category].mandatory.push({
                        Course_Code: course.Course_Code,
                       "Course Name": course["Course Name"],
                        Credits: course.Credits,
                        Prerequisites: course.Prerequisites,
                        Category: course.Category,
                        level: course.level
                    });
                }
            } else if (isOptional) {
                if (remainingHours[category].optional > 0) {
                    eligibleCourses[category].optional.push({
                        Course_Code: course.Course_Code,
                       "Course Name": course["Course Name"],
                        Credits: course.Credits,
                        Prerequisites: course.Prerequisites,
                        Category: course.Category,
                        level: course.level
                    });
                }
            }
        }

        return {
            success: true,
            eligibleCourses,
            // mandatoryCourses,
            // optionalCourses,
            remainingHours,
            completedHours,
            studentLevel,
            studentGPA
        };

    } catch (error) {
        console.error('Error in registerStudent:', error);
        throw error;
    }
}

router.get("/register", (req, res) => {
    res.render('../Views/register-course.ejs')
})



// نقطة نهاية لتسجيل الطالب
router.post('/register', async (req, res) => {
    const { studentId, maxHoursPerTerm, minHoursPerTerm } = req.body;
    
    // متطلبات الساعات حسب الفئة والنوع
    const requiredHours = {
        General: { mandatory: 10, optional: 5 },    // عامة: 10 إجباري + 5 اختياري
        College: { mandatory: 58, optional: 12 },   // كلية: 58 إجباري + 12 اختياري
        Major: { mandatory: 30, optional: 18 },     // قسم: 30 إجباري + 18 اختياري
        Project: { mandatory: 11, optional: 0 }      // مشروع: حسب الحاجة
    };

    try {
        const result = await registerStudent(
            studentId,
            maxHoursPerTerm,
            minHoursPerTerm,
            requiredHours
        );
        console.log ('result' , result)

        res.json({
            result
        });
    } catch (error) {
        console.error('حدث خطأ:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            error: error.stack 
        });
    }
});


////////////// Main Algorithm ////////////////////

// نقطة نهاية لجلب المواد المسجلة للطالب
router.get('/registered-courses/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const studentCourses = await getStudentCourses(studentId);
        
        const coursesDetails = [];
        for (const courseId of studentCourses) {
            const course = await courseModel.findById(courseId).exec();
            if (course) {
                coursesDetails.push({
                    Course_Code: course.Course_Code,
                    Course_Name: course.Course_Name,
                    Credits: course.Credits,
                    Category: course.Category,
                    level: course.level
                });
            }
        }

        res.json({
            success: true,
            registeredCourses: coursesDetails
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

module.exports = router;