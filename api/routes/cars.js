const passport = require('passport');

const Car = require('../../models/car');
const Trip = require('../../models/trip');

const jtwAuth = passport.authenticate('jwt', { session: false });

const { validateBody, schemas } = require('../helpers/routeHelper');

module.exports = function (router) {
    // GET: cars for the logged in user.
    router.route('/cars').get(jtwAuth, function (req, res) {
        Car.find({ userId: req.user.id }, function (err, results) {
            if (err) {
                res.status(400).json(err);
            }
            return res.status(200).json(results);
        });
    });

    // POST: create a new car
    router.route('/cars').post(validateBody(schemas.carSchema), jtwAuth, async function (req, res) {
        try {
            if (req.value.body.default) {
                // Remove default car in case the one being created is set to be the new default one.
                const defaultCar = await Car.findOne({ default: true });
                await Car.updateOne({ _id: defaultCar._id }, { default: false });
            }
            const newCar = new Car({ ...req.value.body, userId: req.user.id });
            const car = await newCar.save();
            return res.status(200).json(car);
        } catch (error) {
            res.status(400).json({message: 'Bad request.', error});
        }
    });

    // DELETE: cart for the logged in user.
    router.route('/cars/:carId').delete(jtwAuth, async function (req, res) {
        const car = await Car.findOne({ _id: req.params.carId });
        if (!car) {
            return res.status(404).json({message: 'Car not found'});
        }
        if (car.userId !== req.user.id) {
            return res.status(403).json({message: 'Not authorized.'});
        }
        // Delete car
        const deletedCar = await Car.deleteOne({_id: req.params.carId});
        // Delete the trips associated to this car
        const deletedTrips = await Trip.deleteMany({carId: req.params.carId});
        return res.status(200).json({deletedCars: deletedCar.deletedCount, deletedTrips: deletedTrips.deletedCount});
    });

    // GET: get specific car only if the user is authorized.
    router.route('/cars/:carId').get(jtwAuth, async function (req, res) {
        const car = await Car.findOne({ _id: req.params.carId });
        if (!car) {
            return res.status(404).json({message: 'Car noot found'});
        }
        if (car.userId !== req.user.id) {
            return res.status(403).json({message: 'Not authorized.'})
        }
        return res.status(200).json(car);
    });
};