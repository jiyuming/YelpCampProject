module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;  //moved to app.js
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
