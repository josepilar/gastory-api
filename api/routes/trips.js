const passport = require('passport');

const Trip = require('../../models/trip');

const jtwAuth = passport.authenticate('jwt', { session: false });

module.exports = function (router) {
    // GET: trips for the logged in user.
    router.route('/trips').get(jtwAuth, function (req, res) {
        console.log(req.user.id);

        Trip.find({ userId: req.user.id }).sort('date').exec(function (err, results) {
            if (err) {
                res.status(400).json(err);
            }
            return res.status(200).json(results);
        });
    });
};
