const { Events, Client, Message } = require('discord.js');
import { sleep, cleanText } from '../../globalFunc';
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
    const t = cleanText(message?.content);

    google.discoverAPI(DISCOVERY_URL).then(c => {
      const analyzeRequest = {
        comment: {
          text: t,
        },
        requestedAttributes: {
          TOXICITY: {},
          OBSCENE: {},
          PROFANITY: {},
          INSULT: {},
          THREAT: {},
        },
      };

      c.comments.analyze(
        { key: API_KEY, resource: analyzeRequest },
        async (err, response) => {
          if (err) return;

          const { TOXICITY, OBSCENE, PROFANITY, INSULT, THREAT } =
            response.data.attributeScores;
          let totalPercentage =
            ((TOXICITY.summaryScore.value +
              OBSCENE.summaryScore.value +
              PROFANITY.summaryScore.value +
              INSULT.summaryScore.value +
              THREAT.summaryScore.value) *
              100) /
            5;

          console.log(totalPercentage);

          totalPercentage = Math.ceil(totalPercentage);

          console.log(totalPercentage);

          if (totalPercentage >= 40) {
            await message.delete();
            const detectedParameters = [];

            if (TOXICITY.summaryScore.value >= 0.4) {
              detectedParameters.push('Toxicity');
            }
            if (OBSCENE.summaryScore.value >= 0.4) {
              detectedParameters.push('Obscene language');
            }
            if (PROFANITY.summaryScore.value >= 0.4) {
              detectedParameters.push('Profanity');
            }
            if (INSULT.summaryScore.value >= 0.4) {
              detectedParameters.push('Insult');
            }
            if (THREAT.summaryScore.value >= 0.4) {
              detectedParameters.push('Threat');
            }

            const detectedParametersString = detectedParameters.join(', ');

            const reply = await message.channel.send({
              content: `<@${message.author.id}> Your message contained multiple security issues: \*\*${detectedParametersString}\*\*. Please adhere to the server's rules.`,
            });

            await sleep(10000);
            reply.delete();
          }
        }
      );
    });
  },
};
