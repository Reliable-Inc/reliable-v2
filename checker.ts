'use strict';

import chalk from 'chalk';
import * as fs from 'fs';
import Configuration from './config';
import dotenv from 'dotenv';

dotenv.config();

const { cyan, blue, greenBright, red, white, yellow, bold, whiteBright, gray } =
  chalk;

// enum StrictErrorExpectedValues {
//   strict = 'strict',
//   string = 'string',
//   number = 'number',
//   boolean = 'boolean',
// }

/**
 * ConfigurationError
 * @typedef {string[]} Message[]
 */
type Message = string;
class ConfigurationError extends Error {
  /**
   * A Custom Error.
   * @param {Message[]} message - The error message
   */
  constructor(...message: Message[]) {
    super(message.join(' '));
    this.name = 'ConfigurationError';
  }
}

/**
 * ConfigurationTypeError
 */
class ConfigurationTypeError extends TypeError {
  /**
   * A Custom Error.
   * @param {Message[]} message - The error message
   */
  constructor(...message: Message[]) {
    super(message.join(' '));
    this.name = 'ConfigurationTypeError';
  }
}

class StrictError extends Error {
  private expected: string;
  private received: string;

  constructor(message: string, expected: 'strict', received?: 'none') {
    super(message);
    this.name = 'StrictError';
    this.expected = expected ?? '';
    this.received = received ?? '';
  }

  public toString() {
    const stack = this.stack?.split('\n').slice(2).join('\n');
    const received = this.received ? `${gray('|')} ${gray(this.received)}` : '';

    return `${red(this.name)} > ${yellow(this.message)}\n${red('Expected:')} ${
      this.expected
    }\n${red('Received:')} ${this.received}\n\n${received}\n\n${gray(stack)}`;
  }
}

type ErrorType =
  | 'Error'
  | 'TypeError'
  | 'SyntaxError'
  | 'ReferenceError'
  | 'RangeError'
  | 'Custom';
type ErrorName = string;
type ErrorMessage = string;

function createCustomErrorClass(errorName: ErrorName): any {
  return eval(`
    class ${errorName} extends Error {
      constructor(message) {
        const errorMessage = message.join("\\n");
        super(\`${errorName}\\n\${errorMessage}\`);
        this.name = "${errorName}";
        Object.setPrototypeOf(this, new.target.prototype);
      }
    }
    
    ${errorName};
  `);
}

export function throwError(
  errorType: ErrorType,
  errorName: ErrorName,
  ...message: ErrorMessage[]
): void {
  if (errorType === 'Custom') {
    const customErrorClass = createCustomErrorClass(errorName);
    throw new customErrorClass(message);
  }

  const errorConstructor = globalThis[errorType] || Error;
  const errorMessage = message.join('\n');
  throw new errorConstructor(`${errorName}\n${errorMessage}`);
}

const Token = process?.env['Token'] ?? '';

// ConfiguratonError
if (!Token) {
  const errorMessage =
    cyan('[ BUG Checker ]') +
    white.bold(' | ') +
    blue(`${new Date().toLocaleDateString()}`) +
    white.bold(' | ') +
    whiteBright("The token isn't provided in .env folder.") +
    white.bold(' | ') +
    yellow.bold('Solution') +
    white(': ') +
    bold.greenBright(`Please provide the Token in your environment variables.`);
  throwError('Custom', 'ConfigurationError', `${errorMessage}`);
}
if (!process?.env['MongoDB'] ?? '') {
  const errorMessage =
    cyan('[ BUG Checker ]') +
    white.bold(' | ') +
    blue(`${new Date().toLocaleDateString()}`) +
    white.bold(' | ') +
    whiteBright("The MongoDB URL isn't provided in .env folder.") +
    white.bold(' | ') +
    yellow.bold('Solution') +
    white(': ') +
    bold.greenBright(
      `Please provide the MongoDB URL in your environment variables.`
    );
  throwError('Custom', 'ConfigurationError', `${errorMessage}`);
}

if (!process?.env['MongoDB'] ?? ''.includes('mongodb+srv://')) {
  const errorMessage =
    cyan('[ BUG Checker ]') +
    white.bold(' | ') +
    blue(`${new Date().toLocaleDateString()}`) +
    white.bold(' | ') +
    whiteBright("You've provided an invalid MongoDB Url.") +
    white.bold(' | ') +
    yellow.bold('Solution') +
    white(': ') +
    bold.greenBright(
      `Please check the MongoDB URL in your environment variables.`
    );
  throwError('Custom', 'ConfigurationError', `${errorMessage}`);
}

if (!process?.env['ClientId'] ?? '') {
  const errorMessage =
    greenBright('[ BUG Checker ]') +
    white.bold(' | ') +
    blue(`${new Date().toLocaleDateString()}`) +
    white.bold(' | ') +
    whiteBright("Client ID isn't provided in .env file") +
    white.bold(' | ') +
    yellow.bold('Solution') +
    white(': ') +
    bold.cyanBright(
      `Please make sure to add the Client ID to the .env file and restart the bot.`
    );
  throwError('Custom', 'ConfigurationError', `${errorMessage}`);
}

if (!Configuration?.developerIds ?? '') {
  throw new ConfigurationError(
    `Developer IDs are not provided in the config.js file`
  );
}

// ConfigurationTypeError
if (typeof Token !== 'string') {
  throwError(
    'Custom',
    'ConfigurationError',
    'Invalid Token',
    'was provided.',
    `\nExpected type of Token to be a valid "string" but got ${typeof Token} instead.`
  );
}

if (typeof process?.env['MongoDB'] !== 'string') {
  throw new ConfigurationTypeError(
    'Invalid MongoDB',
    'was provided',
    `\nExpected type of MongoDB to be a valid "string" but got ${typeof process
      ?.env['MongoDB']} instead.`
  );
}

if (
  Array.isArray(Configuration?.developerIds ?? '') &&
  Configuration?.developerIds?.every((id: any) => typeof id === 'string')
) {
  // do nothing, configuration is correct
} else {
  throw new ConfigurationTypeError(
    `Expected type of developerIds in config.js to be a string array but got ${typeof Configuration.developerIds} instead.`
  );
}

// Strict Checking
loadModule('./index.js');

async function loadModule(path: string) {
  const resolvedPath = require.resolve(path);
  const code = fs.readFileSync(resolvedPath, 'utf8');
  const lines = code.split('\n');
  const isStrictEnabled = lines.some(line => line.includes('strict'));

  if (!isStrictEnabled) {
    throw new StrictError(
      `Strict is not enabled in ${resolvedPath}`,
      'strict',
      'none'
    );
  }
}

/**
 * @INFO
 * Bot Coded by Sohom829#8350 & Alpha•#7395
 * You can't use this codes without permissions!
 * Powered By Reliable Inc.
 */
