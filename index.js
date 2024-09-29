const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const {USER_JWT_SECRET, ADMIN_JWT_SECRET, userAuth, adminAuth} = require('./auth.js');
const {UserModel, CourseModel, AdminModel, UserCoursesModel} = require('./db.js');

const app = express();
app.use(express.json());

app.post("/users/signup", async function (req, res) {
    await UserModel.create({
        email: req.body.email,
        password: req.body.password
    })

    res.json({message : "You are signed up as User"});

})

app.post("/users/login", async function (req, res) {

    const foundUser = await UserModel.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if(!foundUser) {
        res.json({message : "No such User exists, please signup"});
    }

    console.log(foundUser);
    const token = jwt.sign(req.body.email, USER_JWT_SECRET);

    res.json({ 
        "message": "User created successfully", 
        "token": token
    });
    
})

app.post("/users/courses/:courseId", userAuth, async function (req, res) {
    const user = await UserModel.findOne({
        email: req.body.userid
    })

    console.log(user);

    
    let usercourses = await UserCoursesModel.findOne({
        userid: user._id
    })

    const courseOid = new mongoose.Types.ObjectId(req.params.courseId)
    console.log(courseOid);


    let coursesUpd = [];
    if (usercourses) {
        coursesUpd = usercourses.courses;
        coursesUpd.unshift(courseOid);
        await UserCoursesModel.updateOne(
            {userid: user._id},
            {courses: coursesUpd}
        )
    } else {
        coursesUpd = [];
        coursesUpd.push(courseOid);
        await UserCoursesModel.create({
            userid: user._id,
            courses: coursesUpd
        })
    }
    

    res.json({message : "Course purchased successfully"});
    
})

app.get("/users/courses", userAuth, async function (req, res) {
    let courses = await CourseModel.find();
    let response = [];

    courses.forEach(course => {
        let c = {
            "_id": course._id,
            "title": course.title,
            "description": course.description,
            "price": course.price,
            "imageLink": course.imageLink,
            "published": course.published
        }

        response.push(c);
    })

    res.json({courses : response});
})

app.get("/users/purchasedCourses", userAuth, async function (req, res) {
    
    const user = await UserModel.findOne({
        email: req.body.userid
    })

    let usercourses = await UserCoursesModel.findOne({
        userid: user._id
    })

    console.log(usercourses);

    let courses = await CourseModel.find({
        _id: usercourses.courses
    })

    let response = [];

    courses.forEach(course => {
        let c = {
            "_id": course._id,
            "title": course.title,
            "description": course.description,
            "price": course.price,
            "imageLink": course.imageLink,
            "published": course.published
        }

        response.push(c);
    })

    res.json({purchasedCourses: response});
})

app.post("/admin/signup", async function (req, res) {
    await AdminModel.create({
        email: req.body.email,
        password: req.body.password
    })

    res.json({message : "You are signed up as Admin"});

})

app.post("/admin/login", async function (req, res) {
    const foundUser = await AdminModel.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if(!foundUser) {
        res.json({message : "No such Admin exists, please signup"});
    }

    const token = jwt.sign(req.body.email, ADMIN_JWT_SECRET);

    res.json({ 
        "message": "Admin created successfully", 
        "token": token
    });
    
})

app.post("/admin/courses", adminAuth, async function (req, res) {
    const oId = await AdminModel.findOne({
        email: req.body.userid
    });

    const course = await CourseModel.create({
        title: req.body.title, 
        description: req.body.description, 
        price: req.body.price, 
        imageLink: req.body.imageLink, 
        published: req.body.published,
        adminUserId: oId._id
    })

    //TODO : return not whole course just its id
    res.json({
        message: "Course created successfully", 
        courseId: course._id.toString()
    })  
})

app.put("/admin/courses/:courseId", adminAuth, async function (req, res) {
    const oId = new mongoose.Types.ObjectId(req.params.courseId);
    
    const course = await CourseModel.updateOne(
        {_id: oId },
        {
            title: req.body.title, 
            description: req.body.description, 
            price: req.body.price, 
            imageLink: req.body.imageLink, 
            published: req.body.published,
        });

    res.json({ 
        message: "Course updated successfully" 
    })
    
})

app.get("/admin/courses", adminAuth, async function (req, res) {
    const oId = await AdminModel.findOne({
        email: req.body.userid
    })

    let courses = [];
    courses = await CourseModel.find({
        adminUserId: oId._id
    })

    let response = [];

    courses.forEach(course => {
        let c = {
            "_id": course._id,
            "title": course.title,
            "description": course.description,
            "price": course.price,
            "imageLink": course.imageLink,
            "published": course.published
        }

        response.push(c);
    })

    res.json({
        "courses": response
    })
    
})


app.listen(3000);
