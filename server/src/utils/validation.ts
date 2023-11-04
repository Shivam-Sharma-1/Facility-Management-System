import Joi from "joi";

const authSchema = Joi.object({
	image: Joi.string().uri(),
	name: Joi.string().min(3),
	employeeId: Joi.number().min(1),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
		.required()
		.min(8),
	role: Joi.string(),
	// groupId: Joi.string(),
}).with("employeeId", "password");

export default authSchema;
