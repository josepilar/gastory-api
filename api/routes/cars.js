const passport = require('passport');

const Car = require('../../models/car');

const jtwAuth = passport.authenticate('jwt', { session: false });

module.exports = function (router) {
    // GET: cart for the logged in user.
    router.route('/cars').get(jtwAuth, function (req, res) {
        Car.find({ userId: req.user.id }, function (err, results) {
            if (err) {
                res.status(400).json(err);
            }
            return res.status(200).json(results);
        });
    });
};