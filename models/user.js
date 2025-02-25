const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSaveErrors } = require("../helpers");

const nameRegexp = /^\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/;
const emailRegexp = /^.+@.+$/;
const passwordRegexp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      match: passwordRegexp,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveErrors);

const registerSchema = Joi.object({
  name: Joi.string().min(3).pattern(nameRegexp).trim().required(),
  email: Joi.string().email().trim().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required().pattern(passwordRegexp).messages({
    "string.pattern.base":
      "A password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required().pattern(passwordRegexp).messages({
    "string.pattern.base":
      "A password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces",
  }),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().email().trim().pattern(emailRegexp).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
};

const User = model("user", userSchema);

module.exports = { User, schemas };
