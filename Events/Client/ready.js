const { Client, Events, ActivityType } = require('discord.js');
const Configuration = require('../../config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { logTaDAsync, renderDoubledLinesAsync } = require('syc-logger');
dotenv.config();
const MongoURL = process.env['MongoDB'];
const chalk = require('chalk');
const clientId = process.env['ClientId'];
const guildId = Configuration.default.guildId;

module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    const line = renderDoubledLinesAsync(30);
    console.log('');
    console.log(
      chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
        chalk.blue.bold('Bot Info') +
        chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(
      chalk.white(
        `${
          client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
            ? 'Users:'
            : 'User:'
        }`
      ),
      chalk.red(
        `${client?.guilds?.cache?.reduce((a, b) => a + b.memberCount, 0)}`
      ),
      chalk.white('||'),
      chalk.white(
        `${client?.guilds?.cache?.size > 1 ? 'Servers:' : 'Server:'}`
      ),
      chalk.red(`${client?.guilds?.cache?.size}`)
    );
    console.log(
      chalk.white(`Prefix:` + chalk.red(' /')),
      chalk.white('||'),
      chalk.white(`Commands:`),
      chalk.red(`${client.commands.size}`)
    );

    console.log('');
    console.log(
      chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
        chalk.blue.bold('Statistics') +
        chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );
    console.log(
      chalk.white(`Running on Node`),
      chalk.green(process.version),
      chalk.white('on'),
      chalk.green(`${process.platform} ${process.arch}`)
    );
    console.log(
      chalk.white('Memory:'),
      chalk.green(`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}`),
      chalk.white('MB')
    );
    console.log(
      chalk.white('RSS:'),
      chalk.green(
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}`
      ),
      chalk.white('MB')
    );
    console.log('');
    console.log(
      chalk.white.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫') +
        chalk.blue.bold('Client Status') +
        chalk.white.bold('┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    );

    mongoose.set('strictQuery', true);

    mongoose
      .connect(MongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(
          chalk.cyan('[ INFORMATION ]') +
            chalk.white.bold(' | ') +
            chalk.blue(`${new Date().toLocaleDateString()}`) +
            chalk.white.bold(' | ') +
            chalk.cyan('Mongo DB Connection') +
            chalk.white(': ') +
            chalk.greenBright(`Connected`)
        );
      });
    console.log(
      chalk.cyan('[ INFORMATION ]') +
        chalk.white.bold(' | ') +
        chalk.blue(`${new Date().toLocaleDateString()}`) +
        chalk.white.bold(' | ') +
        chalk.cyan('Mongo DB Connection') +
        chalk.white(': ') +
        chalk.greenBright(`Disconnected`)
    );
    console.log(
      chalk.cyan('[ INFORMATION ]') +
        chalk.white.bold(' | ') +
        chalk.blue(`${new Date().toLocaleDateString()}`) +
        chalk.white.bold(' | ') +
        chalk.cyan('Logged in as') +
        chalk.white(': ') +
        chalk.greenBright(`${client.user.tag}`)
    );
    const commands = client.commands.map(({ data }) => data?.toJSON());

    const rest = new REST({ version: '10' }).setToken(process?.env['Token']);

    try {
      console.log(
        chalk.cyan('[ INFORMATION ]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan('Application Commands (/)') +
          chalk.white(': ') +
          chalk.greenBright(`Refresing`)
      );

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });

      console.log(
        chalk.cyan('[ INFORMATION ]') +
          chalk.white.bold(' | ') +
          chalk.blue(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan('Slash Commands (/)') +
          chalk.white(': ') +
          chalk.greenBright(`Refreshed`)
      );

      client?.user.setStatus(Configuration.default.botPresence.status);
      client?.user.setActivity(Configuration.default.botPresence.activity, {
        type: Configuration.default.botPresence.activityType,
      });
    } catch (error) {
      console.log(
        chalk.greenBright('[ ANTICRASH ]') +
          chalk.white.bold(' | ') +
          chalk.red.bold(`${new Date().toLocaleDateString()}`) +
          chalk.white.bold(' | ') +
          chalk.cyan('Error reloading application (/) commands') +
          chalk.white(': ') +
          chalk.red.bold(error)
      );
    }
  },
};
