'use strict';

// Run checker.
require('./checker.js');

// All Modules/File Loading
import * as fs from 'fs';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const cookieParser = require('cookie-parser');
import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} from 'discord.js';
import chalk from 'chalk';
import ServerKey from './Schemas/ServerKey';
import * as cb from 'discordjs-colors-bundle';
import Report from './Schemas/Reports';
const Configuration = require('./config');
import axios from 'axios';
require('dotenv').config();

const clientId = process.env.ClientId;
console.log(clientId);
const clientSecret = process.env.ClientSecret;
console.log(clientId);
const redirectUri = Configuration.default.redirectUri;

const app = express();
const port = 3000;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Express Server
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const validateServerKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-server-key'] || req.query.serverkey;
    if (!apiKey) {
      return res.status(401).json({ message: 'Server key is required.' });
    }

    const serverKey = await ServerKey.findOne({ key: apiKey });
    if (!serverKey) {
      return res.status(401).json({ message: 'Invalid API key.' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
      hint: {
        error: err.message,
      },
    });
  }
};

app.get('/', (req, res) => {
  const currentDate = new Date().toLocaleString();
  const clientIP = req.ip;
  const userAgent = req.headers['user-agent'];
  const language = req.headers['accept-language'];
  const encoding = req.headers['accept-encoding'];
  const message = `Welcome to Reliable Inc.!\nCurrent date: ${currentDate}\nYour IP address: ${clientIP}\nYour user agent: ${userAgent}\nYour language preference: ${language}\nYour encoding preference: ${encoding}`;
  const styledMessage = `<div style="background-color: #1c1c1c; padding: 20px; color: white; font-family: Arial, sans-serif;"> <h1 style="color: #ff9900; margin-bottom: 20px;">Welcome to Reliable Inc.!</h1> <div style="display: flex; flex-direction: row;"> <div style="flex: 1; margin-right: 20px;"> <img src="https://cdn.discordapp.com/avatars/1030870443005071512/e95fc7583e69c92dab1612e8a3060181.webp?size=1024" alt="Logo" style="width: 200px;"> </div> <div style="flex: 2;"> <p style="font-size: 18px; line-height: 1.5; margin-bottom: 20px;">${message}</p> <div style="background-color: #ff9900; color: #1c1c1c; padding: 10px; border-radius: 5px; display: inline-block;"> <p style="margin: 0; font-weight: bold;">Attention!</p> <p style="margin: 0;">This project is for demonstration purposes only.</p> </div> </div> </div> <p style="margin-top: 20px;">Thank you for visiting us today!</p> 

<p style="color: #666;">Copyright &copy; Reliable Inc.</p>
    </div>`;
  res.status(200).set('Content-Type', 'text/html').send(styledMessage);
});

app.get('/api/v1/client.users', validateServerKey, (req, res) => {
  try {
    const clientTotalUsers = client?.guilds?.cache?.reduce(
      (a, b) => a + b.memberCount,
      0
    );
    return res.status(200).json({
      message: {
        body: {
          status: {
            message: 'OK',
            code: 200,
          },
          client: {
            info: `Name: ${client.user.tag}`,
            total_users: clientTotalUsers,
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
      hint: {
        error: err?.message,
      },
    });
  }
});

app.get('/api/v1/client.servers', validateServerKey, (req, res) => {
  try {
    const clientTotalServers = client?.guilds?.cache?.size;
    return res.status(200).json({
      message: {
        body: {
          status: {
            message: 'OK',
            code: 200,
          },
          client: {
            info: `Name: ${client.user.tag}`,
            total_servers: clientTotalServers,
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: {
        body: {
          status: {
            message: 'Internal Server Error',
            code: 500,
          },
          hint: {
            error: err?.message,
          },
        },
      },
    });
  }
});

app.get('/api/v1/client.info', validateServerKey, (req, res) => {
  try {
    const clientTotalServers = client?.guilds?.cache?.size;
    const clientTotalUsers = client?.guilds?.cache?.reduce(
      (a, b) => a + b.memberCount,
      0
    );

    return res.status(200).json({
      message: {
        body: {
          status: {
            message: 'OK',
            code: 200,
          },
          client: {
            info: {
              name: client?.user.tag,
              total_guilds: clientTotalServers,
              total_users: clientTotalUsers,
            },
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: {
        body: {
          status: {
            message: 'Internal Server Error',
            code: 500,
          },
          hint: {
            error: err?.message,
          },
        },
      },
    });
  }
});

app.post('/api/v1/embed.send', validateServerKey, async (req, res) => {
  const {
    e_title,
    e_desc,
    e_footer = 'Reliable',
    e_color = 'Red',

    channel_id,
  } = req.query;

  const color = e_color;

  if (!e_title || !e_desc || !channel_id) {
    return res.status(404).json({
      message: {
        body: {
          status: {
            message: 'Not found',
            code: 404,
          },
          error: {
            hint: 'A required value is not provided.',
            values: ['e_title', 'e_desc', 'channel_id'],
          },
        },
      },
    });
  }

  const channel = client?.channels.cache.get(channel_id.toString());
  const desc = e_desc.replace(/\\n/g, '\n');

  const Embed = new EmbedBuilder()
    .setTitle(e_title.toString())
    .setDescription(desc.toString())
    .setColor(
      color.toString() in cb.Colors
        ? cb.Colors[e_color.toString()]
        : e_color.toString()
    )
    .setFooter({ text: e_footer.toString() });

  try {
    await channel.send({ embeds: [Embed] });
    res.status(200).json({
      message: {
        body: {
          status: {
            message: 'OK',
            code: 200,
          },
          sent: 1,
          embed_body: {
            title: e_title,
            description: desc,
            color: e_color,
            footer: e_footer,
            to_channel: channel_id,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: {
        body: {
          status: {
            message: 'Internal Server Error',
            code: 500,
          },
          error: {
            hint: 'An error occurred while sending the message.',
          },
        },
      },
    });
  }
});

app.post('/api/v1/bug.submit', validateServerKey, async (req, res) => {
  const {
    bug_title,
    bug_desc,
    bug_exp,
    reported_by,
    reported_pfp,
    reported_date,
    e_footer = 'Reliable',
    e_color = 'Red',
  } = req.query;

  const channelId = '1029808315481460798';

  if (
    !bug_title ||
    !bug_desc ||
    !bug_exp ||
    !reported_by ||
    !reported_pfp ||
    !reported_date
  ) {
    return res.status(404).json({
      message: {
        body: {
          status: {
            message: 'Not found',
            code: 404,
          },
          error: {
            hint: 'A required value was not provided.',
            values: [
              'bug_title',
              'bug_desc',
              'bug_exp',
              'reported_by',
              'reported_pfp',
              'reported_date',
            ],
          },
        },
      },
    });
  }

  const newReport = new Report({
    BugTitle: bug_title,
    BugDescription: bug_desc,
    BugExpectation: bug_exp,
    ReportedBy: reported_by,
    ReportedPfp: reported_pfp,
    ReportedDate: reported_date,
  });

  const channel = client?.channels.cache.get(channelId.toString());
  const desc = bug_desc.replace(/\\n/g, '\n');

  const Embed = new EmbedBuilder()
    .setTitle(bug_title.toString())
    .setDescription(
      `${desc.toString()}\n\n${bug_exp.toString()}\n\n### Reported By: ${reported_by}`
    )
    .setColor(cb.Colors[e_color.toString()] || e_color.toString())
    .setFooter({ text: e_footer.toString() })
    .setThumbnail(reported_pfp);

  try {
    await channel.send({ embeds: [Embed] });
    await newReport.save();

    res.status(200).json({
      message: {
        body: {
          status: {
            message: 'OK',
            code: 200,
          },
          sent: 1,
          embed_body: {
            bugTitle: bug_title,
            description: {
              bugDescription: bug_desc,
              bugExpectation: bug_exp,
            },
            reports: {
              reported_by: reported_by,
              reported_user_pfp: reported_pfp,
              reported_date: reported_date,
            },
            color: e_color,
            footer: e_footer,
            to_channel: channelId,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: {
        body: {
          status: {
            message: 'Internal Server Error',
            code: 500,
          },
          error: {
            hint: 'An error occurred while sending the message.',
          },
        },
      },
    });
  }
});

app.get('/api/v1/bug.views', validateServerKey, async (req, res) => {
  try {
    const bugReports = await Report.find();

    if (!bugReports) {
      return res.status(200).json({ message: "There's no bug reports." });
    }

    res.status(200).json(bugReports);
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

// DELETE route: Delete a specific bug report
app.delete('/api/v1/bug.delete', validateServerKey, async (req, res) => {
  const { bug_report_title, bug_report_by } = req.query;

  try {
    await Report.findOneAndDelete({
      BugTitle: bug_report_title,
      ReportedBy: bug_report_by,
    });

    res.status(200).json({
      message: 'Bug report deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(
    chalk.cyan('[ INFORMATION ]') +
      chalk.white.bold(' | ') +
      chalk.blue(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(' | ') +
      chalk.cyan('Server started on port') +
      chalk.white(': ') +
      chalk.greenBright(`${port}`)
  );
});
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

const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&response_type=code&scope=identify email`;

app.get('/login', (req, res) => {
  res.redirect(oauthUrl);
});

app.get('/callback', async ({ query }, response) => {
  const { code } = query;

  if (code) {
    try {
      const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `https://reliable-v2.mohtasimalamsoh.repl.co/callback`,
          scope: 'identify email',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const oauthData = tokenResponse.data;

      response.cookie('access_token', oauthData.access_token);
      response.cookie('token_type', oauthData.token_type);
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      // tokenResponse.status will be 401
      console.error(error);
    }
  }

  return response.send('Success!');
});

app.get('/api/v1/user.info', validateServerKey, async (req, res) => {
  const tokenType = req.cookies.token_type;
  const accessToken = req.cookies.access_token;
  const userResult = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  });

  if (userResult.status == 401 || userResult.status == 404) {
    return res.status(601).json({
      body: {
        hint: 'Multiple problems while fetching a ThirdParty API.',
        status: {
          message: 'API Fetch Error',
          code: 601,
        },
      },
    });
  }

  res.status(200).json(userResult.data);
});

// Commands
const commandFolder = fs.readdirSync('./Commands');
for (const folder of commandFolder) {
  const commandFiles = fs
    .readdirSync(`./Commands/${folder}`)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./Commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

// Event Manager

const eventFolder = fs.readdirSync('./Events');

for (const folder of eventFolder) {
  const eventFiles = fs
    .readdirSync(`./Events/${folder}`)
    .filter(file => file.endsWith('.js'));

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

const componentsFolder = fs.readdirSync('./Components');

for (const folder of componentsFolder) {
  const componentsFile = fs
    .readdirSync(`./Components/${folder}`)
    .filter(file => file.endsWith('.js'));

  switch (folder) {
    case 'buttons':
      {
        for (const file of componentsFile) {
          const button = require(`./Components/${folder}/${file}`);
          client.buttons.set(button.data.name, button);
        }
      }
      break;
    case 'selectMenus':
      {
        for (const file of componentsFile) {
          const menu = require(`./Components/${folder}/${file}`);
          client.selectMenus.set(menu.data.name, menu);
        }
      }
      break;
    case 'modals': {
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
  chalk.cyan('[ INFORMATION ]') +
    chalk.white.bold(' | ') +
    chalk.blue(`${new Date().toLocaleDateString()}`) +
    chalk.white.bold(' | ') +
    chalk.cyan('AntiCrash Connection') +
    chalk.white(': ') +
    chalk.greenBright(`Connected`)
);
process.on('unhandledRejection', (reason, p) => {
  console.log(
    chalk.greenBright('[ ANTICRASH ]') +
      chalk.white.bold(' | ') +
      chalk.red.bold(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(' | ') +
      chalk.cyan('Unhandled') +
      chalk.white(': ') +
      chalk.red.bold(`Rejection/Catch`)
  );
  console.log(reason, p);
});
process.on('uncaughtException', (err, origin) => {
  console.log(
    chalk.greenBright('[ ANTICRASH ]') +
      chalk.white.bold(' | ') +
      chalk.red.bold(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(' | ') +
      chalk.cyan('Uncaught') +
      chalk.white(': ') +
      chalk.red.bold(`Exception/Catch`)
  );
  console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(
    chalk.greenBright('[ ANTICRASH ]') +
      chalk.white.bold(' | ') +
      chalk.red.bold(`${new Date().toLocaleDateString()}`) +
      chalk.white.bold(' | ') +
      chalk.cyan('Uncaught') +
      chalk.white(': ') +
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
