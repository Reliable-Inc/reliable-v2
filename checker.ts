"use strict";

import chalk from "chalk";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { Configuration } from "./config";
dotenv.config();

// Types
type ModuleName = "./index.js" | "./config.js";

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

class StrictError extends Error {
  required;
  constructor(...message) {
    super(message.join(" "));
    this.name = "StrictError";
    this.required = "strict";
    this.message = `${this.message}\n${this.required}`;
  }
}

const Token = process.env["Token"];

// ConfiguratonError
if (!Token) {
  const errorMessage =
    chalk.cyan("[ BUG Checker ]") +
    chalk.white.bold(" | ") +
    chalk.blue(`${new Date().toLocaleDateString()}`) +
    chalk.white.bold(" | ") +
    chalk.whiteBright("The token isn't provided in .env folder.") +
    chalk.white.bold(" | ") +
    chalk.yellow.bold("Solution") +
    chalk.white(": ") +
    chalk.bold.greenBright(
      `Please provide the MongoDB URL in your environment variables.`
    );
  throw new ConfigurationError(`${errorMessage}`);
}
if (!process.env["MongoDB"]) {
  const errorMessage =
    chalk.cyan("[ BUG Checker ]") +
    chalk.white.bold(" | ") +
    chalk.blue(`${new Date().toLocaleDateString()}`) +
    chalk.white.bold(" | ") +
    chalk.whiteBright("The MongoDB URL isn't provided in .env folder.") +
    chalk.white.bold(" | ") +
    chalk.yellow.bold("Solution") +
    chalk.white(": ") +
    chalk.bold.greenBright(
      `Please provide the MongoDB URL in your environment variables.`
    );
  throw new ConfigurationError(`${errorMessage}`);
}
if (!process.env["MongoDB"].includes("mongodb+srv://")) {
  const errorMessage =
    chalk.cyan("[ BUG Checker ]") +
    chalk.white.bold(" | ") +
    chalk.blue(`${new Date().toLocaleDateString()}`) +
    chalk.white.bold(" | ") +
    chalk.whiteBright("You've provided an invalid MongoDB Url.") +
    chalk.white.bold(" | ") +
    chalk.yellow.bold("Solution") +
    chalk.white(": ") +
    chalk.bold.greenBright(
      `Please check the MongoDB URL in your environment variables.`
    );
  throw new ConfigurationError(`${errorMessage}`);
}

if (!process.env["ClientId"]) {
  const errorMessage =
    chalk.greenBright("[ BUG Checker ]") +
    chalk.white.bold(" | ") +
    chalk.blue(`${new Date().toLocaleDateString()}`) +
    chalk.white.bold(" | ") +
    chalk.whiteBright("Client ID isn't provided in .env file") +
    chalk.white.bold(" | ") +
    chalk.yellow.bold("Solution") +
    chalk.white(": ") +
    chalk.bold.cyanBright(
      `Please make sure to add the Client ID to the .env file and restart the bot.`
    );
  throw new ConfigurationError(`${errorMessage}`);
}

if (!Configuration.developerIds) {
  throw new ConfigurationError(
    `Developer IDs are not provided in the config.js file`
  );
}

// ConfigurationTypeError
if (typeof Token !== "string") {
  throw new ConfigurationTypeError(
    "Invalid Token",
    "was provided.",
    `\nExpected type of Token to be a valid "string" but got ${typeof Token} instead.`
  );
}

if (typeof process.env["MongoDB"] !== "string") {
  throw new ConfigurationTypeError(
    "Invalid MongoDB",
    "was provided",
    `\nExpected type of MongoDB to be a valid "string" but got ${typeof process
      .env["MongoDB"]} instead.`
  );
}

if (
  Array.isArray(Configuration.developerIds) &&
  Configuration.developerIds.every((id) => typeof id === "string")
) {
  // do nothing, configuration is correct
} else {
  throw new ConfigurationTypeError(
    `Expected type of developerIds in config.js to be a string array but got ${typeof Configuration.developerIds} instead.`
  );
}

// Strict Checking
loadModule("./index.js");

async function loadModule(path: string) {
  const resolvedPath = require.resolve(path);
  const code = fs.readFileSync(resolvedPath, "utf8");
  if (!code.includes(`"use strict";`)) {
    throw new StrictError("Strict is not enabled in", resolvedPath);
  }
}

/**
 * @INFO
 * Bot Coded by Sohom829#8350 & Alpha•#7395
 * You can't use this codes without permissions!
 * Powered By Reliable Inc.
 */