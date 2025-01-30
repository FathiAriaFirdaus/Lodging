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
import { User, Room, Reservation } from './relation.js';


import { Sequelize } from "sequelize";

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

app.listen(port, ()=> {
    console.log(`Server running on port:${port}`)
});