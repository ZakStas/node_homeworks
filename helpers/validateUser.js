const Joi = require('@hapi/joi');

function validateUser(req, res, next) {
	const contactSchema = Joi.object({
		email: Joi.string().required(),
		password: Joi.string().required()
	});
	const result = contactSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error);
	}
  next();
}

module.exports = {
  validateUser
}