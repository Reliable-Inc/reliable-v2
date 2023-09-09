const { Client, Message } = require('discord.js');
const { sleep } = require('../../globalFunc');
const { google } = require('googleapis');
const API_KEY = process.env.P_API_KEY;
const DISCOVERY_URL =
  'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

import AntiObsceneGuildIDs from '../../Schemas/AntiObscene';
module.exports = {
  name: 'messageCreate', // Correct the event name
  once: false,

  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const guildId = message.guild.id;

    const enabled = await AntiObsceneGuildIDs.findOne({ guildId });

    if (!enabled) return;

    google
      .discoverAPI(DISCOVERY_URL)
      .then(c => {
        const analyzeRequest = {
          comment: {
            text: message?.content,
          },
          requestedAttributes: {
            OBSCENE: {},
          },
        };

        c.comments.analyze(
          { key: API_KEY, resource: analyzeRequest },
          async (err, response) => {
            if (err) return;
            const obj = JSON.parse(JSON.stringify(response.data, null, 2));
            const percentage =
              obj.attributeScores.OBSCENE.summaryScore.value * 100;
            if (Math.ceil(percentage) >= 50) {
              try {
                const reply = await message.channel.send({
                  content: `<@${message.author.id}> Obscene content isn't allowed in this server.`,
                });
                await message.delete();
                await sleep(10000);
                await reply.delete();
              } catch (error) {
                console.error('Error while deleting message:', error);
              }
            }
          }
        );
      })
      .catch(error => {
        console.error('Error discovering API:', error);
      });
  },
};
