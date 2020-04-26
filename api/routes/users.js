const passport = require('passport');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { validateBody, schemas } = require('../helpers/routeHelper');
const sendEmail = require('../helpers/emailHelper');
const User = require('../../models/user');

const localAuth = passport.authenticate('local', { session: false });

function signToken(id, secret) {
  const reset = (60 * 60 * 2); // 2 hours
  const standard = (60 * 60 * 24 * 180)
  return JWT.sign({
    iss: 'gastory',
    sub: id,
    iat: new Date().getTime(),
    exp: Math.floor(Date.now() / 1000) + (secret ? reset : standard)
  }, secret || process.env.JWT_SECRET);
}

async function verifyResetToken(req, res, next) {
  const payload = JWT.decode(req.value.body.token);
  const foundUser = await User.findOne({ email: payload.sub });
  if (foundUser) {
    try {
      JWT.verify(req.value.body.token, foundUser.password);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ success: false, message: error.message });
    }
    req.value.body.id = foundUser.id;
    return next();
  }
  return res.status(403).json('perro');
}

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  } catch (error) {
    console.error('Error hashing password');
  }
  return;
}

module.exports = function (router) {
  router.route('/signup').post(validateBody(schemas.authSchema), async function (req, res) {
    const { email, password, username, profilePicture, displayName } = req.value.body;

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.status(403).json({ success: false, message: 'this username is already in use' })
    }

    const newUser = new User({ email, password: hashPassword(password), username, profilePicture, displayName });
    await newUser.save();
    const token = signToken(newUser.id);

    return res.status(200).json({
      success: true,
      message: `User ${username} created`,
      user: {
        displayName: newUser.displayName,
        username: newUser.username,
        id: newUser.id,
        profilePicture: newUser.profilePicture
      },
      token
    });
  });
  router.route('/signin').post(validateBody(schemas.signinSchema), localAuth, async function (req, res) {
    const token = signToken(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'sucessfully logged in',
      user: {
        displayName: req.user.displayName,
        username: req.user.username,
        id: req.user.id,
        profilePicture: req.user.profilePicture
      },
      token
    });
  });

  router.route('/reset-password').post(validateBody(schemas.resetPassword), async function (req, res) {
    const { email } = req.value.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      const token = signToken(email, foundUser.password);
      sendEmail(email, token);
    }

    return res.status(200).json();
  });

  router.route('/change-password').post(validateBody(schemas.changePassword), verifyResetToken, async function (req, res) {
    const { id } = req.value.body;
    const foundUser = await User.findById(id);
    foundUser.password = await hashPassword(req.value.body.password);
    await foundUser.save();
    res.status(200).json({ success: true, message: "Password successfully changed." });
  });

  router.route('/check-reset-token').post(validateBody(schemas.verifyToken), verifyResetToken, function (req, res) {
    return res.status(200).json({ success: true, message: 'Valid token.' });
  });

  router.route('/user/change-password').post(validateBody(schemas.changePasswordUser), localAuth, async function (req, res) {
    res.status(200).json({ success: true, message: "Password successfully changed." }); // need to update the password
  });
};