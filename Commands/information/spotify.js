import { CustomRGB } from "discordjs-colors-bundle";
import * as Musixmatch from "musixmatch-api-node";
const { MusixmatchAPI } = Musixmatch;
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const mxm = new MusixmatchAPI(process?.env["Musixmatch"].toString());

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spotify')
    .setDescription('Spotify informations!')
    .addSubcommand((sub) => 
      sub.setName('current').setDescription('Get your current playing status')
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() == "current") {
      const member = interaction.member;

      const Embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s current playing status`);

      const activity = member.presence.activities.find(
        (activity) => activity.type === 2 && activity.name === 'Spotify'
      );

      if (activity) {
        const trackName = activity.details || "Unknown";
        let artistName = activity.state.toString() || "Unknown";
if (artistName.includes(";")) {
  artistName = artistName.replace(/;/g, '');
}

const semicolonCount = (activity.state.toString().match(/;/g) || []).length;
let aName = "Unknown";

if (semicolonCount === 1) {
  aName = activity.state.toString().replace(";", " feat.");
} else if (semicolonCount === 2) {
  aName = activity.state.toString().replace(";", " feat.").replace(";", " &");
} else if (semicolonCount >= 3) {
  aName = activity.state
    .toString()
    .replace(";", " feat.")
    .replace(";", ",")
    .replace(/;/g, " &");
} else {
  aName = activity.state.toString().replace(/;/g, ",");
}

        const trackInfo = await mxm.trackSearch({ artistName: artistName, trackName: trackName });
const hasLyrics =  trackInfo?.has_lyrics ? "Yes" : "No";
        // const albumName = trackInfo?.album_name.toString();
       const id = trackInfo?.track_id;
       const deepSearch = await mxm.trackSearch({ artistName: artistName, trackName: trackName, id: id});
       const albumName = deepSearch?.album_name;
        const isInstrumental = trackInfo?.instrumental ? "Yes" : "No";
        const isExplicit = trackInfo?.explicit ? "Yes" : "No"
        Embed.addFields(
          { name: "Track Name", value: trackName, inline: true },
          { name: "Artist Name", value: aName, inline: true },
          { name: "Album Name", value: `${albumName}`, inline: true },
          { name: "Has Lyrics?", value: hasLyrics, inline: true },
          { name: "Is Instrumental?", value: isInstrumental, inline: true},
          { name: "Is Explicit?", value: isExplicit, inline: true }
          
        );
        Embed.setColor(CustomRGB(0, 255, 170));
      } else {
        Embed.setDescription("You are not currently listening to Spotify.");
      }

      return interaction.reply({ embeds: [Embed], ephemeral: true });
    }
  },
};
