import { CustomRGB } from 'discordjs-colors-bundle';
import { Musixmatch } from 'node-musixmatch-api';
import { albumInfoGet } from './albumTrackAutoComplete';
const {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Client,
} = require('discord.js');
const mxm = new Musixmatch();
mxm.setApiKey(`${process?.env['Musixmatch'].toString()}`);
const fs = require('fs');
const fetch = require('node-fetch');

const clientId = process.env['Spotify_Client_Id'];
const clientSecret = process.env['Spotify_Client_Secret'];

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

function writeAccessTokenToFile(accessToken) {
  fs.writeFile('tokens.txt', accessToken, err => {
    if (err) throw err;
  });
}

getAccessToken()
  .then(accessToken => writeAccessTokenToFile(accessToken))
  .catch(err => console.error('Error retrieving access token:', err));

setInterval(() => {
  getAccessToken()
    .then(accessToken => writeAccessTokenToFile(accessToken))
    .catch(err => console.error('Error retrieving access token:', err));
}, 3600000);

async function getTrackInfo(artistName, trackName) {
  const accessToken = await getAccessToken();

  const searchParams = new URLSearchParams();
  searchParams.append('q', `artist:${artistName} track:${trackName}`);
  searchParams.append('type', 'track');
  searchParams.append('limit', '1');

  const response = await fetch(
    `https://api.spotify.com/v1/search?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  if (data.tracks.items.length > 0) {
    const track = data.tracks.items[0];
    const trackInfo = {
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls.spotify,
      albumIcon: track.album.images[0].url,
      durationMs: track.duration_ms,
      trackId: track.id,
      isrc: track.external_ids.isrc,
    };
    return trackInfo;
  } else {
    throw new Error('Track not found');
  }
}

module.exports = {
  beta: false,
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription(
      'Initiate the 🎵 Spotify information command to access comprehensive details.'
    )
    .addSubcommand(sub =>
      sub.setName('current').setDescription('Get your current playing status.')
    )
    .addSubcommand(sub =>
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
    await interaction.deferReply({ fetchReply: true, ephemeral: true });

    if (interaction.options.getSubcommand() == 'info') {
      const member = interaction.member;
      const activity = member.presence.activities.find(
        activity => activity.type === 2 && activity.name === 'Spotify'
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

        const info = await getTrackInfo(artistName, trackName);

        const albumIcon = info?.albumIcon;
        const durationMs = info?.durationMs;
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);

        const formattedDuration = `${minutes}:${seconds
          .toString()
          .padStart(2, '0')}`;

        const SpotifyId = info?.trackId;
        const deepSearch = await mxm.trackGet(`track_isrc=${info?.isrc}`);
        const albumId = deepSearch?.message.body.track.album_id;
        const id = deepSearch?.message.body.track.track_id;
        const albumName = info?.album;
        const hasLyrics = deepSearch?.message.body.track.has_lyrics
          ? 'Yes'
          : 'No';

        const isInstrumental = deepSearch?.message.body.track.instrumental
          ? 'Yes'
          : 'No';
        const isExplicit = deepSearch?.message.body.track.explicit
          ? 'Yes'
          : 'No';
        const trackRating = deepSearch?.message.body.track.track_rating;
        const lyricsRes = await mxm.matcherLyricsGet(
          `track_isrc=${info?.isrc}`
        );
        const lyrics =
          lyricsRes.message.body.lyrics.lyrics_body.replace(
            /\*\* This Lyrics is NOT for Commercial use \*\*/g,
            '30% Lyrics By Musixmatch'
          ) ?? 'Lyrics is unavailable.';
        const albumSearch = await albumInfoGet(albumId);
        const albumTracks = albumSearch.message.body.track_list
          .map((track, index) => `${index + 1}. ${track.track.track_name}`)
          .join('\n');

        const Embed = new EmbedBuilder()
          .setTitle(`__Your spotify status__`)
          .setDescription(
            `Presenting an extensive and thorough overview of the complete information pertaining to your current Spotify listening session, including track name, artist name, album details, availability of lyrics, instrumental status, and explicit content classification. Please find the comprehensive report below, offering detailed insights into your present Spotify experience.`
          )
          .setColor(0x2f3136)
          .setFooter({ text: 'Reliable | Your trusted assistant' })
          .setDescription(`## Lyrics:\n${lyrics}`)
          .addFields(
            {
              name: '__Track Information__',
              value: `**\`‣\` Artist Name**: \`${
                aName ?? 'N/A'
              }\`\n**\`‣\` Album Name**: \`${
                albumName ?? 'N/A'
              }\`\n**\`‣\` Explicit**: \`${
                isExplicit ?? 'Yes'
              }\`\n**\`‣\` Duration**: \`${
                formattedDuration ?? '0:00'
              }\`\n**\`‣\` ISRC**: \`${
                info?.isrc ?? 'ABCDEFGH123'
              }\`\n**\`‣\` ID**: \`${
                id ?? '12345678'
              }\`\n**\`‣\` Album Id**: \`${
                albumId ?? '12345678'
              }\`\n**\`‣\` Spotify Id**: \`${SpotifyId ?? '12345678'}\``,
              inline: true,
            },
            {
              name: '**__More tracks on this album__**',
              value: `${albumTracks}`,
              inline: true,
            }
          )
          .setThumbnail(albumIcon);

        const MXMLink =
          deepSearch?.message.body.track.track_share_url.split(
            '?utm_source'
          )[0] ?? 'https://www.musixmatch.com';
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
            .setLabel(`Track Rating Musixmatch: ${trackRating ?? '0'}`)
            .setStyle('Secondary')
            .setDisabled(true),
          new ButtonBuilder()
            .setLabel(`Full Lyrics`)
            .setStyle('Link')
            .setURL(MXMLink ?? 'https://www.musixmatch.com')
        );
        return interaction.editReply({
          embeds: [Embed],
          components: [bcomponents],
        });
      }
    }
  },
};
