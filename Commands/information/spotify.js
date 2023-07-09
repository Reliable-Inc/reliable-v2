import { CustomRGB } from 'discordjs-colors-bundle';
import * as Musixmatch from 'musixmatch-api-node';
const { MusixmatchAPI } = Musixmatch;
const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');
const mxm = new MusixmatchAPI(process?.env['Musixmatch'].toString());
const puppeteer = require('puppeteer');

async function wrapAPI(apiUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the API URL
  await page.goto(apiUrl);

  // Extract the API response
  const apiResponse = await page.evaluate(() => {
    return fetch(location.href)
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error fetching API:', error);
        return null;
      });
  });

  await browser.close();

  return apiResponse;
}

module.exports = {
  beta: true,
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription(
      'Initiate the 🎵 Spotify information command to access comprehensive details.'
    )
    .addSubcommand((sub) =>
      sub.setName('current').setDescription('Get your current playing status.')
    )
    .addSubcommand((sub) =>
      sub
        .setName('info')
        .setDescription('Get your current playing information.')
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    if (interaction.options.getSubcommand() == 'current') {
      try {
        const member = interaction.member;
        const activity = member.presence.activities.find(
          (activity) => activity.type === 2 && activity.name === 'Spotify'
        );

        if (activity) {
          const trackName = activity.details || 'Unknown';
          let artistName = activity.state.toString() || 'Unknown';
          if (artistName.includes(';')) {
            artistName = artistName.replace(/;/g, '');
          }

          const semicolonCount = (activity.state.toString().match(/;/g) || [])
            .length;
          let aName = 'Unknown';

          if (semicolonCount === 1) {
            aName = activity.state.toString().replace(';', ' feat.');
          } else if (semicolonCount === 2) {
            aName = activity.state
              .toString()
              .replace(';', ' feat.')
              .replace(';', ' &');
          } else if (semicolonCount >= 3) {
            aName = activity.state
              .toString()
              .replace(';', ' feat.')
              .replace(';', ',')
              .replace(/;/g, ' &');
          } else {
            aName = activity.state.toString().replace(/;/g, ',');
          }

          const trackInfo = await mxm.trackSearch({
            artistName: artistName,
            trackName: trackName,
          });
          const id = trackInfo?.track_id;
          const hasLyrics = (await mxm.hasLyrics(id.toString())) ? 'Yes' : 'No';
          const deepSearch = await mxm.trackSearch({
            artistName: artistName,
            trackName: trackName,
            id: id,
          });
          const albumName = deepSearch?.album_name;
          const isInstrumental = (await mxm.isInstrumental(id.toString()))
            ? 'Yes'
            : 'No';
          const isExplicit = (await mxm.isExplicit(id.toString()))
            ? 'Yes'
            : 'No';
          const trackRating = deepSearch?.track_rating;

          const Embed = new EmbedBuilder()
            .setTitle(`__Your spotify status__`)
            .setColor(`#2F3136`)
            .setFooter({ text: 'Reliable | Your trusted assistant' })
            .setDescription(
              `Presenting an extensive and thorough overview of the complete information pertaining to your current Spotify listening session, including track name, artist name, album details, availability of lyrics, instrumental status, and explicit content classification. Please find the comprehensive report below, offering detailed insights into your present Spotify experience.`
            )
            .addFields({
              name: '__Track Information__',
              value: `**\`‣\` Artist Name**: \`${aName || 'N/A'}\`
**\`‣\` Album Name**: \`${albumName || 'N/A'}\`
**\`‣\` Explicit**: \`${isExplicit}\``,
            });

          const bcomponents = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('torbap')
              .setLabel(`Track Name: ${trackName ?? 'N/A'}`)
              .setStyle('Secondary')
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('chudi')
              .setLabel(`Has Lyrics?: ${hasLyrics ?? 'No'}`)
              .setStyle('Secondary')
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('kutta')
              .setLabel(`Instrumental: ${isInstrumental ?? 'Yes'}`)
              .setStyle('Secondary')
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('kuttachuda')
              .setLabel(`Track Rating: ${trackRating ?? '0'}`)
              .setStyle('Secondary')
              .setDisabled(true)
          );
          return interaction.reply({
            embeds: [Embed],
            components: [bcomponents],
            ephemeral: true,
          });
        } else {
          const embed1 = new EmbedBuilder()
            .setColor(`#2F3136`)
            .setFooter({ text: 'Reliable | Your trusted assistant' })
            .setTitle('Error | 403 Forbidden')
            .setDescription(`<:reliable_dnd:1044914867779412078> | 
Regrettably, it appears that you are not presently engaged in any Spotify audio playback activity. Thus, there is no current record of Spotify streaming from your account. Should you initiate playback in the future, your Spotify listening status will be promptly updated and made available for retrieval.`);
          return interaction.reply({ embeds: [embed1], ephemeral: true });
        }
      } catch (e) {
        const embed = new EmbedBuilder()
          .setColor(`#2F3136`)
          .setFooter({ text: 'Reliable | Your trusted assistant' })
          .setTitle('Error | 500 Internal Server')
          .setDescription(
            `<:reliable_dnd:1044914867779412078> | The server encountered an unexpected condition that prevented it from fulfilling the request. It is an internal error on the server side, typically caused by misconfigurations, software bugs, or server overload. Users should contact the server administrator for resolution.`
          );

        console.log(e);

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() == 'info') {
      await interaction.deferReply({ ephemeral: true });
      const member = interaction.member;
      const activity = member.presence.activities.find(
        (activity) => activity.type === 2 && activity.name === 'Spotify'
      );

      if (activity) {
        const trackName = activity.details || 'Unknown';
        let artistName = activity.state.toString() || 'Unknown';
        if (artistName.includes(';')) {
          artistName = artistName.replace(/;/g, '');
        }

        const semicolonCount = (activity.state.toString().match(/;/g) || [])
          .length;
        let aName = 'Unknown';

        if (semicolonCount === 1) {
          aName = activity.state.toString().replace(';', ' feat.');
        } else if (semicolonCount === 2) {
          aName = activity.state
            .toString()
            .replace(';', ' feat.')
            .replace(';', ' &');
        } else if (semicolonCount >= 3) {
          aName = activity.state
            .toString()
            .replace(';', ' feat.')
            .replace(';', ',')
            .replace(/;/g, ' &');
        } else {
          aName = activity.state.toString().replace(/;/g, ',');
        }

        const options = {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'x-mxm-signature': 'v0pwaG293G5sXkpYHJ8fmPbpckw',
            'x-mxm-signature-protocol': 'sha1',
          },
          AWSELB:
            '55578B011601B1EF8BC274C33F9043CA947F99DCFF6AB1B746DBF1E96A6F2B997493EE03F2045E23060D22ED54D7B8D422981DE4D537EFD5DCF9DA7B0658AA87EB7AE701D7',
          AWSELBCORS:
            '55578B011601B1EF8BC274C33F9043CA947F99DCFF6AB1B746DBF1E96A6F2B997493EE03F2045E23060D22ED54D7B8D422981DE4D537EFD5DCF9DA7B0658AA87EB7AE701D7',
        };

        // const lyricsRes = await wrapAPI(
        //   `https://apic-desktop.musixmatch.com/ws/1.1/macro.subtitles.get?format=json&namespace=lyrics_richsynched&subtitle_format=mxm&app_id=web-desktop-app-v1.0&q_artist=${artistName}&q_track=${trackName}&usertoken=200501593b603a3fdc5c9b4a696389f6589dd988e5a1cf02dfdce1`
        // );

        const trackInfo = await mxm.trackSearch({
          artistName: artistName,
          trackName: trackName,
        });
        const id = trackInfo?.track_id;
        const hasLyrics = (await mxm.hasLyrics(id.toString())) ? 'Yes' : 'No';
        const deepSearch = await mxm.trackSearch({
          artistName: artistName,
          trackName: trackName,
          id: id,
        });
        const albumName = deepSearch?.album_name;
        const isInstrumental = (await mxm.isInstrumental(id.toString()))
          ? 'Yes'
          : 'No';
        const isExplicit = (await mxm.isExplicit(id.toString())) ? 'Yes' : 'No';
        const trackRating = deepSearch?.track_rating;

        const Embed = new EmbedBuilder()
          .setTitle(`__Your spotify status__`)
          .setColor(`#2F3136`)
          .setFooter({ text: 'Reliable | Your trusted assistant' })
          // .setDescription(`## Lyrics:\n${lyrics}`)
          .addFields({
            name: '__Track Information__',
            value: `**\`‣\` Artist Name**: \`${aName ?? 'N/A'}\`
**\`‣\` Album Name**: \`${albumName ?? 'N/A'}\`
**\`‣\` Explicit**: \`${isExplicit}\``,
          });

        const bcomponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('torbap1')
            .setLabel(`Track Name: ${trackName ?? 'N/A'}`)
            .setStyle('Secondary')
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('chudi1')
            .setLabel(`Has Lyrics?: ${hasLyrics ?? 'No'}`)
            .setStyle('Secondary')
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('kutta1')
            .setLabel(`Instrumental: ${isInstrumental ?? 'Yes'}`)
            .setStyle('Secondary')
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('kuttachuda1')
            .setLabel(`Track Rating: ${trackRating ?? '0'}`)
            .setStyle('Secondary')
            .setDisabled(true)
        );
        return interaction.editReply({
          embeds: [Embed],
          components: [bcomponents],
          ephemeral: true,
        });
      }
    }
  },
};
