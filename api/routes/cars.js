const Car = require('../../models/car');

module.exports = function (router) {
    // GET: cart for the logged in user.
    router.get('/cars', function (req, res) {
        Car.find({ userId: req.headers['user-id'] }, function (err, results) {
            if (err) {
                res.status(400).json(err);
            }
            return res.status(200).json(results);
        });
    });
};