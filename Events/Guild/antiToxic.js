const { Events, Client, Message } = require('discord.js');
import sleep from '../../globalFunc';
import { google } from 'googleapis';
const API_KEY = process.env['P_API_KEY'.toString()];
let DISCOVERY_URL =
  'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

import GuildIDs from '../../Schemas/AntiToxic';

module.exports = {
  name: Events.MessageCreate,
  once: false,

  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const guildId = message.guildId;

    const enabled = await GuildIDs.findOne({ guildId });

    if (!enabled) return;

    google.discoverAPI(DISCOVERY_URL).then(c => {
      const analyzeRequest = {
        comment: {
          text: message?.content,
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };

      c.comments.analyze(
        { key: API_KEY, resource: analyzeRequest },
        async (err, response) => {
          if (err) return;
          const obj = JSON.parse(JSON.stringify(response.data, null, 2));
          const parcentage =
            obj.attributeScores.TOXICITY.summaryScore.value * 100;
          if (parcentage >= 70) {
            await message.delete();
            const reply = await message.channel.send({
              content: `<@${message.author.id}> Toxicity isn't allowed in this server.`,
            });

            await sleep(10000);
            reply.delete();
          }
          //   console.log('Toxicity Percentage: ');
          //   console.log(JSON.stringify(response.data, null, 2));
        }
      );
    });
  },
};
