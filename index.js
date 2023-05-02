"use strict";

// Run checker.
require("./checker.js");

// All Modules/File Loading

const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const dotenv = require("dotenv");
const chalk = require("chalk");
const express = require("express");
const fs = require("fs");
const app = express();

// Express Server
app.get("/", (req, res) => {
  const currentDate = new Date().toLocaleString();
  const clientIP = req.ip;
  const userAgent = req.headers["user-agent"];
  const language = req.headers["accept-language"];
  const encoding = req.headers["accept-encoding"];
  const message = `Welcome to Reliable Inc.!\nCurrent date: ${currentDate}\nYour IP address: ${clientIP}\nYour user agent: ${userAgent}\nYour language preference: ${language}\nYour encoding preference: ${encoding}`;
  const styledMessage = `<div style="background-color: #1c1c1c; padding: 20px; color: white; font-family: Arial, sans-serif;"> <h1 style="color: #ff9900; margin-bottom: 20px;">Welcome to Reliable Inc.!</h1> <div style="display: flex; flex-direction: row;"> <div style="flex: 1; margin-right: 20px;"> <img src="https://cdn.discordapp.com/avatars/1030870443005071512/e95fc7583e69c92dab1612e8a3060181.webp?size=1024" alt="Logo" style="width: 200px;"> </div> <div style="flex: 2;"> <p style="font-size: 18px; line-height: 1.5; margin-bottom: 20px;">${message}</p> <div style="background-color: #ff9900; color: #1c1c1c; padding: 10px; border-radius: 5px; display: inline-block;"> <p style="margin: 0; font-weight: bold;">Attention!</p> <p style="margin: 0;">This project is for demonstration purposes only.</p> </div> </div> </div> <p style="margin-top: 20px;">Thank you for visiting us today!</p> 

<p style="color: #666;">Copyright &copy; Reliable Inc.</p>
    </div>`;
  res.status(200).set("Content-Type", "text/html").send(styledMessage);
});
const port = 3000;
app.listen(port, () => {
  console.log(
    chalk.cyan("[ INFORMATION ]") +
      chalk.white.bold(" | ") +
      chalk.blue(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(" | ") +
      chalk.cyan("Server started on port") +
      chalk.white(": ") +
      chalk.greenBright(`${port}`)
  );
});
dotenv.config();

// Intents Zone

const client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
});

// Collections Manager
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

// Commands
const commandFolder = fs.readdirSync("./Commands");
for (const folder of commandFolder) {
  const commandFiles = fs
    .readdirSync(`./Commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./Commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

// Event Manager

const eventFolder = fs.readdirSync("./Events");

for (const folder of eventFolder) {
  const eventFiles = fs
    .readdirSync(`./Events/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./Events/${folder}/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

// Components Manager

const componentsFolder = fs.readdirSync("./Components");

for (const folder of componentsFolder) {
  const componentsFile = fs
    .readdirSync(`./Components/${folder}`)
    .filter((file) => file.endsWith(".js"));

  switch (folder) {
    case "buttons":
      {
        for (const file of componentsFile) {
          const button = require(`./Components/${folder}/${file}`);
          client.buttons.set(button.data.name, button);
        }
      }
      break;
    case "selectMenus":
      {
        for (const file of componentsFile) {
          const menu = require(`./Components/${folder}/${file}`);
          client.selectMenus.set(menu.data.name, menu);
        }
      }
      break;
    case "modals": {
      for (const file of componentsFile) {
        const modal = require(`./Components/${folder}/${file}`);
        client.modals.set(modal.data.name, modal);
      }
    }
    default:
      break;
  }
}

//AntiCrash Manager
console.log(
  chalk.cyan("[ INFORMATION ]") +
    chalk.white.bold(" | ") +
    chalk.blue(`${new Date().toLocaleDateString()}`) +
    chalk.white.bold(" | ") +
    chalk.cyan("AntiCrash Connection") +
    chalk.white(": ") +
    chalk.greenBright(`Connected`)
);
process.on("unhandledRejection", (reason, p) => {
  console.log(
    chalk.greenBright("[ ANTICRASH ]") +
      chalk.white.bold(" | ") +
      chalk.red.bold(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(" | ") +
      chalk.cyan("Unhandled") +
      chalk.white(": ") +
      chalk.red.bold(`Rejection/Catch`)
  );
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(
    chalk.greenBright("[ ANTICRASH ]") +
      chalk.white.bold(" | ") +
      chalk.red.bold(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(" | ") +
      chalk.cyan("Uncaught") +
      chalk.white(": ") +
      chalk.red.bold(`Exception/Catch`)
  );
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(
    chalk.greenBright("[ ANTICRASH ]") +
      chalk.white.bold(" | ") +
      chalk.red.bold(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(" | ") +
      chalk.cyan("Uncaught") +
      chalk.white(": ") +
      chalk.red.bold(`Exception/Catch (MONITOR)`)
  );
  console.log(err, origin);
});

client.login(process.env.Token);

/**
 * @INFO
 * Bot Coded by Sohom829#8350 & Alpha•#7395
 * You can't use this codes without permissions!
 * Powered By Reliable Inc.
 **/
