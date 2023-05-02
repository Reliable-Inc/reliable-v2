"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var chalk_1 = __importDefault(require("chalk"));
var dotenv = __importStar(require("dotenv"));
var fs = __importStar(require("fs"));
var config_1 = require("./config");
dotenv.config();
var StrictErrorExpectedValues;
(function (StrictErrorExpectedValues) {
    StrictErrorExpectedValues["strict"] = "strict";
    StrictErrorExpectedValues["string"] = "string";
    StrictErrorExpectedValues["number"] = "number";
    StrictErrorExpectedValues["boolean"] = "boolean";
})(StrictErrorExpectedValues || (StrictErrorExpectedValues = {}));
var ConfigurationError = /** @class */ (function (_super) {
    __extends(ConfigurationError, _super);
    function ConfigurationError() {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        var _this = _super.call(this, message.join(" ")) || this;
        _this.name = "ConfigurationError";
        return _this;
    }
    return ConfigurationError;
}(Error));
var ConfigurationTypeError = /** @class */ (function (_super) {
    __extends(ConfigurationTypeError, _super);
    function ConfigurationTypeError() {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        var _this = _super.call(this, message.join(" ")) || this;
        _this.name = "ConfigurationTypeError";
        return _this;
    }
    return ConfigurationTypeError;
}(TypeError));
var StrictError = /** @class */ (function (_super) {
    __extends(StrictError, _super);
    function StrictError(message, expected, received) {
        var _this = _super.call(this, message) || this;
        _this.name = "StrictError";
        _this.expected = expected !== null && expected !== void 0 ? expected : "";
        _this.received = received !== null && received !== void 0 ? received : "";
        return _this;
    }
    StrictError.prototype.toString = function () {
        var _a;
        var stack = (_a = this.stack) === null || _a === void 0 ? void 0 : _a.split("\n").slice(2).join("\n");
        var received = this.received
            ? "".concat(chalk_1["default"].gray("|"), " ").concat(chalk_1["default"].gray(this.received))
            : "";
        return "".concat(chalk_1["default"].red(this.name), " > ").concat(chalk_1["default"].yellow(this.message), "\n").concat(chalk_1["default"].red("Expected:"), " ").concat(this.expected, "\n").concat(chalk_1["default"].red("Received:"), " ").concat(this.received, "\n\n").concat(received, "\n\n").concat(chalk_1["default"].gray(stack));
    };
    return StrictError;
}(Error));
var Token = process.env["Token"];
// ConfiguratonError
if (!Token) {
    var errorMessage = chalk_1["default"].cyan("[ BUG Checker ]") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].blue("".concat(new Date().toLocaleDateString())) +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].whiteBright("The token isn't provided in .env folder.") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].yellow.bold("Solution") +
        chalk_1["default"].white(": ") +
        chalk_1["default"].bold.greenBright("Please provide the MongoDB URL in your environment variables.");
    throw new ConfigurationError("".concat(errorMessage));
}
if (!process.env["MongoDB"]) {
    var errorMessage = chalk_1["default"].cyan("[ BUG Checker ]") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].blue("".concat(new Date().toLocaleDateString())) +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].whiteBright("The MongoDB URL isn't provided in .env folder.") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].yellow.bold("Solution") +
        chalk_1["default"].white(": ") +
        chalk_1["default"].bold.greenBright("Please provide the MongoDB URL in your environment variables.");
    throw new ConfigurationError("".concat(errorMessage));
}
if (!process.env["MongoDB"].includes("mongodb+srv://")) {
    var errorMessage = chalk_1["default"].cyan("[ BUG Checker ]") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].blue("".concat(new Date().toLocaleDateString())) +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].whiteBright("You've provided an invalid MongoDB Url.") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].yellow.bold("Solution") +
        chalk_1["default"].white(": ") +
        chalk_1["default"].bold.greenBright("Please check the MongoDB URL in your environment variables.");
    throw new ConfigurationError("".concat(errorMessage));
}
if (!process.env["ClientId"]) {
    var errorMessage = chalk_1["default"].greenBright("[ BUG Checker ]") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].blue("".concat(new Date().toLocaleDateString())) +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].whiteBright("Client ID isn't provided in .env file") +
        chalk_1["default"].white.bold(" | ") +
        chalk_1["default"].yellow.bold("Solution") +
        chalk_1["default"].white(": ") +
        chalk_1["default"].bold.cyanBright("Please make sure to add the Client ID to the .env file and restart the bot.");
    throw new ConfigurationError("".concat(errorMessage));
}
if (!config_1.Configuration.developerIds) {
    throw new ConfigurationError("Developer IDs are not provided in the config.js file");
}
// ConfigurationTypeError
if (typeof Token !== "string") {
    throw new ConfigurationTypeError("Invalid Token", "was provided.", "\nExpected type of Token to be a valid \"string\" but got ".concat(typeof Token, " instead."));
}
if (typeof process.env["MongoDB"] !== "string") {
    throw new ConfigurationTypeError("Invalid MongoDB", "was provided", "\nExpected type of MongoDB to be a valid \"string\" but got ".concat(typeof process
        .env["MongoDB"], " instead."));
}
if (Array.isArray(config_1.Configuration.developerIds) &&
    config_1.Configuration.developerIds.every(function (id) { return typeof id === "string"; })) {
    // do nothing, configuration is correct
}
else {
    throw new ConfigurationTypeError("Expected type of developerIds in config.js to be a string array but got ".concat(typeof config_1.Configuration.developerIds, " instead."));
}
// Strict Checking
loadModule("./index.js");
function loadModule(path) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedPath, code, lines, isStrictEnabled;
        return __generator(this, function (_a) {
            resolvedPath = require.resolve(path);
            code = fs.readFileSync(resolvedPath, "utf8");
            lines = code.split("\n");
            isStrictEnabled = lines.some(function (line) { return line.includes("strict"); });
            if (!isStrictEnabled) {
                throw new StrictError("Strict is not enabled in ".concat(resolvedPath), "strict", "none");
            }
            return [2 /*return*/];
        });
    });
}
//# sourceMappingURL=checker.js.map