import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import customMethodOverride from "./middlewares/customMethodOverride.js";
import session from "express-session";
import env from "dotenv";
import passport from "passport";
import loginRouter from "./routes/login.js";
import roomRouter from "./routes/room.js";
import reservationRouter from "./routes/reservation.js";
import paymentRouter from "./routes/payment.js";

import { Sequelize } from "sequelize";
import sequelize from "./db.js";
import './relation.js';
import Reps from './models/Reps.js';
import { User, Room, Reservation } from './relation.js';


const app = express();
const port = process.env.PORT || 3000;
env.config();

//Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(customMethodOverride);


//Session
app.use(
  session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2
  }
  })
);

import "./auth/passport.js";

app.use(passport.initialize());
app.use(passport.session())

app.use('/', loginRouter);
app.use('/', roomRouter);
app.use('/', reservationRouter);
app.use('/', paymentRouter);


sequelize.sync({ alter: true }) // Bisa pakai { force: true } untuk reset tabel (hati-hati!)
  .then(() => {
    console.log("Database synced successfully!");

    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });