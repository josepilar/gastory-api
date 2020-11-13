const passport = require('passport');

const Trip = require('../../models/trip');
const Car = require('../../models/car');
const { validateBody, schemas } = require('../helpers/joiHelper');

const jtwAuth = passport.authenticate('jwt', { session: false });

module.exports = function (router) {
    // GET: trips for the logged in user.
    router.route('/trips').get(jtwAuth, function (req, res) {
        Trip.find({ userId: req.user.id }).sort('date').exec(function (err, results) {
            if (err) {
                res.status(400).json(err);
            }
            return res.status(200).json(results);
        });
    });

    // POST: create a new trip for a given car
    router.route('/trips').post(validateBody(schemas.tripSchema), jtwAuth, async function (req, res) {
        try {
            const car = await Car.findOne({ _id: req.value.body.carId });
            if (!car) return res.status(404).json({message: 'car does not exist.'});
            if (car.userId !== req.user.id) return res.status(403).json({message: 'Not authorized.'});
            const newTrip = new Trip({ ...req.value.body, userId: req.user.id });
            const trip = await newTrip.save();
            return res.status(200).json(trip);
        } catch (error) {
            res.status(400).json({message: 'Bad request.', error});
        }
    });

    // DELETE: Delete a trip
    router.route('/trips/:tripId').delete(jtwAuth, async function (req, res) {
        try {
            if (!req.params.tripId) return res.status(400).json({message: 'Bad request.'});
            const trip = await Trip.findOne({ _id: req.params.tripId });
            if (trip.userId !== req.user.id) return res.status(403).json({message: 'Not authorized'});
            if (!trip) return res.status(404).json({message: 'Trip not found'});
            const deletedTrip = await Trip.deleteOne({ _id: req.params.tripId });
            return res.status(200).json({deletedCount: deletedTrip.deletedCount});
        } catch (error) {
            res.status(404).json({message: 'Not found.'});
        }
    });
};
