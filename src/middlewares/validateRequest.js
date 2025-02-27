import Joi from 'joi';

const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: errorMessage });
    }
    next();
};

export default validateRequest;
