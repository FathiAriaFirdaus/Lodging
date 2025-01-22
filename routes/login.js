import express from "express";
import passport from "passport";
import loginController from "../controllers/loginController.js";
import {ensureAuthenticate, checkUserLevel} from "../auth/protect.js";

const router = new express.Router();

router.get('/', loginController.home);
router.get('/home', ensureAuthenticate, checkUserLevel('user'), loginController.homeLogedIn);
router.get('/homeReceptionist', ensureAuthenticate, checkUserLevel('receptionist'), loginController.homeReceptionist);
router.get('/login', loginController.loginView);
router.get('/register', loginController.registerView);
router.get('/logout', ensureAuthenticate, loginController.logoutUser);

router.post('/login', (req, res, next) => {
    console.log("Login route triggered");

    // Authenticate user with passport
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);  // Menangani error
        }
        if (!user) {
            return res.redirect('/');  // Jika tidak ada user, redirect ke halaman login
        }

        // Setelah autentikasi berhasil, simpan user ke dalam session
        req.login(user, (err) => {
            if (err) {
                return next(err);  // Menangani error saat login
            }

            // Arahkan berdasarkan level user
            // if (user.level === 'admin') {
            //     return res.redirect('/homeAdmin');
            // } else 
            if (user.level === 'receptionist') {
                return res.redirect('/homeReceptionist');
            } else {
                return res.redirect('/home');
            }
        });
    })(req, res, next);
});


router.get('/secret', ensureAuthenticate, checkUserLevel('user'), loginController.secret);
router.post('/register', loginController.registerUser);

export default router;