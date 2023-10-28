import Joi from "joi";

const authSchema = Joi.object({
	name: Joi.string().min(3),
	employee_id: Joi.string().alphanum().min(3).max(30).lowercase(),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
		.required()
		.min(8),
}).with("employeeId", "password");

export default authSchema;
