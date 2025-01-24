import passport from "passport";
import { User } from "../relation.js";
import Room from "../models/Room.js";
import bcrypt, { hash } from "bcrypt";
import Reservation from "../models/Reservation.js";
import Payment from "../models/Payment.js";
import { fn, col, Op } from "sequelize";
import sequelize from "../db.js";

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

const manageReceptionistView = async(req, res) => {

    try{
        const receptionist = await User.findAll({
            where: {level: 'receptionist'}
        });

        res.render("manageReceptionist.ejs", {userData: receptionist});
    }
    catch(err){
        res.status(500).send(err);
    }
}

const editReceptionistView = async(req, res) => {
    const userId = req.params.id;

    try{
        const user = await User.findByPk(userId);
        res.render("editReceptionist", {userSingleData: user});
    }
    catch(err){
        res.status(500).send(err);
    }
}

const editReceptionist = async(req, res) => {
    const userId = req.params.id;
    const userName = req.body.name;

    try{
        const user = await User.update(
            {name: userName},
            {where: {id: userId}}
        );

        res.redirect("/manageReceptionist")
    }
    catch(err){
        res.status(500).send(err);
    }
}

const deleteReceptionist = async(req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.destroy({
            where: {id: userId}
        });
        res.redirect("/manageReceptionist")

    } catch (err) {
        res.status(500).send(err)
    }
}

const addReceptionistView = async(req, res) => {
    res.render("addReceptionist.ejs");
}

const addReceptionist = async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await User.create({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 10),
            level: 'receptionist',
        })

        res.redirect("/manageReceptionist");
    }
    catch(err){
        res.status(500).send(err);
    }
}

const homeAdmin = async (req, res) => {
    try {
        // Hitung total reservasi dan pemasukan berdasarkan bulan dan tahun
        const reportData = await Reservation.findAll({
            attributes: [
                [sequelize.literal('EXTRACT(MONTH FROM "createdAt")'), "month"],
                [sequelize.literal('EXTRACT(YEAR FROM "createdAt")'), "year"],
                [sequelize.fn("COUNT", sequelize.col("id")), "totalReservations"],
            ],
            group: [
                sequelize.literal('EXTRACT(YEAR FROM "createdAt")'),
                sequelize.literal('EXTRACT(MONTH FROM "createdAt")')
            ],
            order: [
                [sequelize.literal('EXTRACT(YEAR FROM "createdAt")'), "DESC"],
                [sequelize.literal('EXTRACT(MONTH FROM "createdAt")'), "DESC"]
            ],
        });

        const incomeData = await Payment.findAll({
            attributes: [
                [sequelize.literal('EXTRACT(MONTH FROM "createdAt")'), "month"],
                [sequelize.literal('EXTRACT(YEAR FROM "createdAt")'), "year"],
                [sequelize.fn("SUM", sequelize.col("amountPaid")), "totalIncome"],
            ],
            group: [
                sequelize.literal('EXTRACT(YEAR FROM "createdAt")'),
                sequelize.literal('EXTRACT(MONTH FROM "createdAt")')
            ],
            order: [
                [sequelize.literal('EXTRACT(YEAR FROM "createdAt")'), "DESC"],
                [sequelize.literal('EXTRACT(MONTH FROM "createdAt")'), "DESC"]
            ],
        });

        // Gabungkan data laporan reservasi dan pemasukan berdasarkan bulan dan tahun
        const mergedData = reportData.map((report) => {
            const income = incomeData.find(
                (inc) =>
                    inc.dataValues.month === report.dataValues.month &&
                    inc.dataValues.year === report.dataValues.year
            );
            return {
                month: report.dataValues.month,
                year: report.dataValues.year,
                totalReservations: report.dataValues.totalReservations,
                totalIncome: income ? income.dataValues.totalIncome : 0,
            };
        });

        console.log("Merged Data to Render:", mergedData);  // Debugging data yang dikirim ke frontend

        res.render("homeLoginAdmin.ejs", { reportData: mergedData });

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
};

  

export default {
    home,
    homeReceptionist,
    homeLogedIn,
    loginView, 
    registerView, 
    registerUser, 
    logoutUser,
    secret,
    homeAdmin,
    manageReceptionistView,
    editReceptionistView,
    editReceptionist,
    deleteReceptionist,
    addReceptionistView,
    addReceptionist,

};