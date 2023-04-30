const dotenv = require("dotenv");
dotenv.config();

class ConfigurationError extends Error {
  constructor(...message) {
    super(message.join(" "));
    this.name = "ConfigurationError";
  }
}

class ConfigurationTypeError extends TypeError {
  constructor(...message) {
    super(message.join(" "));
    this.name = "ConfigurationTypeError";
  }
}

const Token = process.env.Token?.toString();

// ConfiguratonError
if (!Token) {
  throw new ConfigurationError("Token is not provided in env");
}
if (!process.env.MongoDB) {
  throw new ConfigurationError("MongoDB URL is not provided.");
}
if (!process.env.MongoDB.includes("mongodb+srv://")) {
  throw new ConfigurationError("Invalid MongoURL:", process.env.MongoDB);
}

// ConfigurationTypeError
if (typeof Token !== "string") {
  throw new ConfigurationTypeError(
    "Invalid Token",
    "was provided.",
    `\nExpected type of Token to be a valid "string" but got ${typeof Token} instead.`
  );
}
