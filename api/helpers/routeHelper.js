const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
        req.value['body'] = result.value;
        next();
      }
    }
  },
  schemas: {
    authSchema: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
      confirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
      email: Joi.string().required(),
      displayName: Joi.string(),
      profilePicture: Joi.string(),
    }),
    signinSchema: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    }),
    resetPassword: Joi.object().keys({
      email: Joi.string().required()
    }),
    changePassword: Joi.object().keys({
      password: Joi.string().required(),
      confirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
      token: Joi.string().required()
    }),
    changePasswordUser: Joi.object().keys({
      password: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
    }),
    verifyToken: Joi.object().keys({
      token: Joi.string().required()
    }),
    tripSchema: Joi.object().keys({
      trip: Joi.number().required(),
      cost: Joi.number().required(),
      volume: Joi.number().required(),
      carId: Joi.string().required(),
    }),
  }
}