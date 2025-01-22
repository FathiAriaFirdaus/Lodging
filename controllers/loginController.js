import passport from "passport";
import { User } from "../relation.js";
import Room from "../models/Room.js";
import bcrypt, { hash } from "bcrypt";

const home = async(req, res) => {
    const roomData = await Room.findAll(
        {where: {roomAvailable: true}}
    );
    // console.log(roomData);
    res.render("home.ejs", {roomData: roomData});
}

const homeReceptionist = async(req, res) => {
    const roomData = await Room.findAll(
        {where: {roomAvailable: true}}
    );
    // console.log(roomData);
    res.render("homeLoginReceptionist.ejs", {roomData: roomData});
}

const homeLogedIn = async(req, res) => {
    const roomData = await Room.findAll(
        {where: {roomAvailable: true}}
    );
    // console.log(roomData);
    res.render("homeLogin.ejs", {roomData: roomData});
}

const loginView = (req, res) => {
    res.render("login.ejs");
}

const registerView = (req, res) => {
    res.render("register.ejs");
}

const registerUser = async(req, res) => {
    try{
        const userData = {
            name: req.body.name,
            email: req.body.username,
            password: await hash(req.body.password, 10),
            level: "user",
        };

        const user = await User.create(userData);
        res.redirect("/login")
    }
    catch(err){
        console.error(err);
        res.status(500);
    }
}

const logoutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
        res.redirect("/login")
    });
}

const secret = (req, res) => {
    console.log(req.user.email);
    console.log(req.user.password);
    console.log(req.user.level);
    res.render("secret.ejs")
}

export default {
    home,
    homeReceptionist,
    homeLogedIn,
    loginView, 
    registerView, 
    registerUser, 
    logoutUser,
    secret
};