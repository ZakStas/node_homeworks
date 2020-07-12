const Joi = require('@hapi/joi');

function validateCreateContact(req, res, next) {
	const contactSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().required(),
		password: Joi.string().required()
	});
	const result = contactSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error);
	}
	next();
}

function validateUpdateContact(req, res, next) {
	const contactSchema = Joi.object({
		name: Joi.string(),
		email: Joi.string(),
		password: Joi.string()
	}).min(1);
	const result = contactSchema.validate(req.body);
	if (result.error) {
		res.status(400).send(result.error);
	}
    next();
}

module.exports = {
    validateCreateContact,
    validateUpdateContact
}