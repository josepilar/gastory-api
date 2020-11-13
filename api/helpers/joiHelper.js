const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema, { abortEarly: false, allowUnknown: true });
      if (result.error) {
        return res.status(400).json({ errors: result.error.details });
      }
      if (!req.value) {
        req.value = {};
        req.value['body'] = result.value;
        next();
      }
    }
  },
  schemas: {
    authSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
      confirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
      email: Joi.string().required(),
      displayName: Joi.string(),
      profilePicture: Joi.string(),
    }),
    signinSchema: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    }),
    resetPassword: Joi.object({
      email: Joi.string().required()
    }),
    changePassword: Joi.object({
      password: Joi.string().required(),
      confirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
      token: Joi.string().required()
    }),
    changePasswordUser: Joi.object({
      password: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
    }),
    verifyToken: Joi.object({
      token: Joi.string().required()
    }),
    tripSchema: Joi.object({
      trip: Joi.number().required(),
      cost: Joi.number().required(),
      volume: Joi.number().required(),
      carId: Joi.string().required(),
    }),
    carSchema: Joi.object({
      maker: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().required(),
      color: Joi.string().required(),
      plates: Joi.string().required(),
      imageUrl: Joi.string().allow(''),
      default: Joi.boolean()
    }),
  }
}