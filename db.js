const mongoose = require("mongoose");
require('dotenv').config();

const Schema = mongoose.Schema;

mongoose.connect("mongodb+srv://" + process.env.db_username + ":" + process.env.db_password + "@" + process.env.db_cluster + "/course-db");

const User = new Schema({
    email: {type: String, unique: true},
    password: String
});

const Admin = new Schema({
    email: {type: String, unique: true},
    password: String
});

const UserCourses = new Schema({
    userid: {type: Schema.ObjectId, ref: 'users'},
    courses: [{type: Schema.ObjectId, ref: 'courses'}]
})

const Course = new Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
    adminUserId: {type: Schema.Types.ObjectId, ref: 'admins'}
})

const UserModel = mongoose.model('users', User);
const AdminModel = mongoose.model('admins', Admin);
const CourseModel = mongoose.model('courses', Course);
const UserCoursesModel = mongoose.model('usercourses', UserCourses);

module.exports={
    UserModel,
    CourseModel,
    AdminModel,
    UserCoursesModel,
}

