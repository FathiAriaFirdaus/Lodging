export function ensureAuthenticate(req, res, next){
    // This function check if user is authenticated
    console.log("ensureAuthenticate Hit")

    if (req.isAuthenticated()) {
        console.log("user Authenticated")
        return next()
    }

    res.redirect('/login');
}

export function checkUserLevel(requiredLevel){
    // This function check if user level match the requirement
    // user level : user, receptionist, admin

    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }

        // Check required level
        if (req.user.level !== requiredLevel) {
            return res.status(403).send('Forbidden');
        }

        // Continue route if level match
        return next();
    }
}