const { RequestError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(
        RequestError({
          status: 400,
          message: "missing required name field",
        })
      );
    }
    next();
  };
  return func;
};

module.exports = validateBody;
