const jwt = require('jsonwebtoken');
require('dotenv').config();

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

function userAuth (req, res, next) {
    const token = req.headers.token;
    if (!token) {
        res.json({message : "Please Login to continue"});
    }

    jwt.verify(token, USER_JWT_SECRET, (error, data) => {
        if (error) {
            res.json({message : "Invalid token, Please login again"})
        }

        console.log(data);
        req.body.userid = data;
        next();
    })
}

function adminAuth (req, res, next) {
    const token = req.headers.token;
    if (!token) {
        res.json({message : "Please Login to continue"});
    }

    jwt.verify(token, ADMIN_JWT_SECRET, (error, data) => {
        if (error) {
            res.json({message : "Invalid token, Please login again"})
        }

        req.body.userid = data;
        next();
    })
}

module.exports={
    USER_JWT_SECRET,
    ADMIN_JWT_SECRET,
    userAuth,
    adminAuth,
    jwt
}
