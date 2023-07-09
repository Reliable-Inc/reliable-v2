import { CustomRGB } from 'discordjs-colors-bundle';
import * as Musixmatch from 'musixmatch-api-node';
const { MusixmatchAPI } = Musixmatch;
const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
} = require('discord.js');
const mxm = new MusixmatchAPI(process?.env['Musixmatch'].toString());

module.exports = {
  beta: true,
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription(
      'Initiate the 🎵 Spotify information command to access comprehensive details.'
    )
    .addSubcommand((sub) =>
      sub.setName('current').setDescription('Get your current playing status.')
    ),

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
          const hasLyrics = trackInfo?.has_lyrics ? 'Yes' : 'No';
          const id = trackInfo?.track_id;
          const deepSearch = await mxm.trackSearch({
            artistName: artistName,
            trackName: trackName,
            id: id,
          });
          const albumName = deepSearch?.album_name;
          const isInstrumental = trackInfo?.instrumental ? 'Yes' : 'No';
          const isExplicit = trackInfo?.explicit ? 'Yes' : 'No';
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

      return interaction.reply({
        embeds: [Embed],
        components: [components],
        ephemeral: true,
      });
    }
  },
};
