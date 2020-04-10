const Trip = require('../../models/trip');

module.exports = function (router) {
    // GET: trips for the logged in user.
    router.get('/trips', function (req, res) {
        Trip.find({ userId: req.headers['user-id'] }).sort('date').exec(function (err, results) {
            if (err) {
                res.status(400).json(err);
            }
            return res.status(200).json(results);
        });
    });
};
