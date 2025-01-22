import bcrypt, { compare } from "bcrypt";
import LocalStrategy, { Strategy } from "passport-local";
import User from "../models/User.js";
import passport from "passport";

passport.use(
    new Strategy(async function verify(username, password, done) {
        console.log("Passport strategy triggered");
        console.log(username);
        console.log(password);

        try{
            const user = await User.findOne({
                where: {email: username}})
    
            if (!user) {  //When username is invalid
                return done(null, false, { message: 'Incorrect username.' });
            }
        
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) { //When password is invalid 
                return done(null, false, { message: 'Incorrect password.' });
            }
        
            console.log("success");
            return done(null, user); //When user is valid
        }
        catch(err){
            return done(err);
        }
        })
)           
        

passport.serializeUser((user, done) => {
    done(null, user.id);
}) 

passport.deserializeUser(async(id, done) => {
    try{
        const user = await User.findOne({
            where: {
                id: id,
            }
        })

        if (!user) {
            return done(new Error("User not found"), null);
        }

        done(null, user);
        console.log("SUCCESS");
        // console.log(user);
    }
    catch (err) {
        done(err, null)
    }
})
