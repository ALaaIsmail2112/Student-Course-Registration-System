# Student Course Registration System

An intelligent backend system built with **Node.js**, **Express.js**, and **MongoDB** to manage student course registrations.  
This system handles user authentication, course eligibility checks based on prerequisites, GPA, and departmental requirements, and allows students to register for courses accordingly.

---

## 🚀 Project Overview

This backend API supports a full workflow for course registration including:

- Student login and session management  
- Fetching mandatory and optional courses for a student’s department  
- Checking student’s completed and remaining credit hours by course category  
- Validating course prerequisites before registration  
- Filtering eligible courses based on GPA, level, and previously registered courses  
- Returning lists of eligible courses and registered courses

The system uses MongoDB collections for students, courses, registrations, department-course relations, and course prerequisites.

**Important:**  
All data used in this project was collected and curated personally by me, ensuring data quality and relevance to the application requirements.

---

## 🛠 Features

- **Student Login:** Secure login with email and password verification (currently plain-text, consider hashing for production)  
- **Course Eligibility:** Calculates eligible courses based on departmental mandatory/optional courses, student GPA, completed credits, and prerequisites  
- **Credit Hour Tracking:** Tracks completed and remaining credit hours in categories: General, College, Major, and Project  
- **Course Registration API:** Endpoint to get eligible courses and register students within defined constraints  
- **Registered Courses Endpoint:** Retrieve courses a student has already registered for

---

## 💻 Technologies Used

- Node.js with Express.js  
- MongoDB with Mongoose ODM  
- Session management for user login state  
- EJS templating for simple views (login and registration pages)  

---

## 📁 Project Structure

- `routes/registration.js` — Contains all routes and business logic related to student login and course registration  
- `models/` — Mongoose schemas dynamically created inside the connection initializer  
- `views/` — EJS templates for login and registration forms

---

## 🔧 API Endpoints

| Endpoint                 | Method | Description                             |
|--------------------------|--------|-------------------------------------|
| `/login`                 | GET    | Render login page                    |
| `/login`                 | POST   | Authenticate student and create session |
| `/register`              | GET    | Render registration page             |
| `/register`              | POST   | Register student courses and get eligible courses |
| `/registered-courses/:studentId` | GET    | Get courses registered by a student |

---

🤝 Contribution
Feel free to fork the repo, open issues, or submit pull requests. Suggestions and improvements are welcome!

## 📫 Contact

If you have any questions or want to collaborate, feel free to reach out to me:

- ✉️ **Email:** [alaaismailmohamed144@gmail.com](mailto:alaaismailmohamed144@gmail.com)  
- 🔗 **LinkedIn:** [Alaa Ismail](https://www.linkedin.com/in/alaa-ismail-b09493264)
