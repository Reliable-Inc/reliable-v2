const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  GuildVerificationLevel,
  GuildExplicitContentFilter,
  GuildNSFWLevel,
  Embed,
  ActionRowBuilder,
} = require("discord.js");
const { CustomHex, CustomRGB } = require("discordjs-colors-bundle")
const moment = require("moment");
const axios = require("axios");
const twitter = require("twitter-api.js");
const translate = require("@iamtraction/google-translate");
const imdb = require("imdb-api");
const mal = require("mal-scraper");

module.exports = {
  beta: true,
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("info command")
    .addSubcommand((sub) =>
      sub
        .setName("anime")
        .setDescription("💮 Search for information about Anime by given name")
        .addStringOption((option) =>
          option.setName("query").setDescription("Anime name").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("channel")
        .setDescription("View ℹ️ info about a 📺 channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Mention the channel")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("movie")
        .setDescription("View ℹ️ info about a 🎥 movie.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the movie")
            .setRequired(true)
        )
    )

    .addSubcommand((sub) =>
      sub
        .setName("covid-countries")
        .setDescription("Track 🌍 a country's COVID-19 cases 📊")
        .addStringOption((op) =>
          op
            .setName("country")
            .setDescription("Provide a country")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("country")
        .setDescription("Get ℹ️ information about a 🌍 country.")
        .addStringOption((op) =>
          op.setName("name").setDescription("Country name").setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("covid-world-wide")
        .setDescription("Track worldwide COVID-19 cases")
    )
    .addSubcommand((sub) =>
      sub
        .setName("member-count")
        .setDescription("see the total members of your server")
    )
    .addSubcommand((sub) =>
      sub
        .setName("npm")
        .setDescription("Check for packages on npm")
        .addStringOption((op) =>
          op
            .setName("name")
            .setDescription("Provide a name to request content from.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("pokemon")
        .setDescription("Returns pokemon information")
        .addStringOption((op) =>
          op
            .setName("name")
            .setDescription("Provide a name to request content from.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("reddit")
        .setDescription("Request random content from Reddit via subreddits.")
        .addStringOption((op) =>
          op
            .setName("subreddit")
            .setDescription("Provide a subreddit to request content from.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("role")
        .setDescription("View info about a role")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to view info of")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("translate")
        .setDescription("Translate any word/sentence to EN")
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("The text to translate")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("from")
            .setDescription("Source Language.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("to")
            .setDescription("Destination Language.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("role-perm")
        .setDescription("Shows a role permissions")
        .addRoleOption((op) =>
          op
            .setName("target")
            .setDescription("Select the target")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("weather")
        .setDescription("get weather information")
        .addStringOption((op) =>
          op
            .setName("place")
            .setDescription("country/city name to get weather information for")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("apod").setDescription("Astronomy Picture of the Day")
    )
    .addSubcommand((sub) =>
      sub.setName("quotes").setDescription("Sends random quotes")
    )
    .addSubcommand((sub) =>
      sub
        .setName("server")
        .setDescription("Displays information about the server.")
    )
    .addSubcommand((sub) =>
      sub
        .setName("user")
        .setDescription("get user info")
        .addUserOption((op) =>
          op
            .setName("target")
            .setDescription("Select the target")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("user-perm")
        .setDescription("Shows a user's permissions")
        .addUserOption((op) =>
          op
            .setName("target")
            .setDescription("Select the target")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("twitter")
        .setDescription("Shows a twitter account information")
        .addStringOption((op) =>
          op
            .setName("account")
            .setDescription("Mention the account name")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("iss-location").setDescription("Shows ISS location")
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() == "anime") {
      const search = interaction.options.getString("query");
      await interaction.deferReply();
      mal.getInfoFromName(search).then((data) => {
        if (data.rating == "Rx - Hentai" && !interaction.channel.nsfw) {
          const embed2 = new EmbedBuilder()
            .setTitle("🔞 | NSFW content")
            .setColor(CustomHex("#2F3136"))
            .setTimestamp()
            .setFooter({ text: "©2022 - 2023 | Reliable" })
            .setDescription(
              "> **<:reliable_wrong:1043155193077960764> | No `Age-Restricted` content allowed in this channel. Go to a channel where `NSFW` is enabled.**"
            );
          return interaction.editReply({ embeds: [embed2], ephemeral: true });
        } else {
          const embed = new EmbedBuilder()
            .setTitle(`${data.title}`)
            .setDescription(`\`\`\`${data.synopsis || "N/A"}\`\`\``)
            .setImage(data.picture)
            .setColor(CustomHex("#2F3136"))
            .addFields(
              {
                name: "__Titles:__",
                value: `**\`•\` English**: **\`${data.englishTitle || "N/A"}\`**
**\`•\` Japanese**: **\`${data.japaneseTitle || "N/A"}\`**`,
                inline: false,
              },
              {
                name: "__Rank & Popularity:__",
                value: `**\`•\` Rank**: **\`${data.ranked || "N/A"}\`**
**\`•\` Popularity**: **\`${data.popularity || "N/A"}\`**`,
                inline: false,
              },
              {
                name: "__Aired & Broadcast:__",
                value: `**\`•\`Aired**: **\`${data.aired || "N/A"}\`**
**\`•\` Broadcast Every**: **\`${data.broadcast || "N/A"}\`**`,
                inline: false,
              },
              {
                name: "__Members & Favorites:__",
                value: `**\`•\`Members**: **\`${data.members || "N/A"}\`**
**\`•\`Favorites**: **\`${data.favorites || "N/A"}\`**`,
                inline: true,
              },
              {
                name: "__Episodes & Durations:__",
                value: `**\`•\`Episodes**: **\`${data.episodes || "N/A"}\`**
**\`•\`Duration Per Episode**: **\`${data.duration || "N/A"}\`**`,
                inline: true,
              },
              {
                name: "__Source & Ratings:__",
                value: `**\`•\`Source**: **\`${data.source || "N/A"}\`**
**\`•\`Ratings**: **\`${data.rating || "N/A"}\`**`,
                inline: true,
              },
              {
                name: "__Score & Score Stats:__",
                value: `**\`•\`Score**: **\`${data.score || "N/A"}\`**
**\`•\`Score Stats**: **\`${data.scoreStats || "N/A"}\`**`,
                inline: true,
              },
              {
                name: "__Studios & Synonyms__",
                value: `**\`•\`Studios**: **\`${data.studios || "N/A"}\`**
**\`•\`Synonyms**: **\`${data.synonyms || "N/A"}\`**`,
                inline: true,
              },
              {
                name: "__Status__",
                value: `**\`•\`Status**: **\`${data.status || "N/A"}\`**`,
                inline: true,
              },
              {
                name: "__Identifier & Type__",
                value: `**\`•\`Identifier**: **\`${data.id || "N/A"}\`**
**\`•\`Type**: **\`${data.type || "N/A"}\`**`,
                inline: true,
              },
              {
                name: "__Characters & Roles:__",
                value: `\`\`\`${
                  data.characters
                    ? data.characters
                        .map((x) => `${x.name}: ${x.role}`)
                        .join("\n")
                    : "N/A"
                }\`\`\``,
                inline: true,
              },
              {
                name: "__Staff & Role:__",
                value: `\`\`\`${
                  data.staff
                    ? data.staff.map((x) => `${x.name}: ${x.role}`).join("\n")
                    : "N/A"
                }\`\`\``,
                inline: true,
              },
              {
                name: "__Producers:__",
                value: `\`\`\`${
                  data.producers ? data.producers.join("\n") : "N/A"
                }\`\`\``,
                inline: true,
              }
            )
            .setFooter({ text: "©2022 - 2023 | Reliable" })
            .setTimestamp();

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setURL(data.url)
              .setLabel("View more about this")
          );
          interaction.editReply({ embeds: [embed], components: [row] });
        }
      });
    } else if (interaction.options.getSubcommand() === "channel") {
      let channel = interaction.options.getChannel("channel") || "";

      const webhooks = await channel.fetchWebhooks();
      const webhookArray = webhooks.size;
      const vcmember = channel.members;
      const memberArray = vcmember.size;
      let channeltype = "Text Channel";
      if (channel.type === 15) {
        channeltype = "Forum";
      }
      if (channel.type === 0) {
        channeltype = "Text";
      }
      if (channel.type === 1) {
        channeltype = "DM";
      }
      if (channel.type === 2) {
        channeltype = "Voice";
      }
      if (channel.type === 3) {
        channeltype = "Group DM";
      }
      if (channel.type === 4) {
        channeltype = "Category";
      }
      if (channel.type === 5) {
        channeltype = "ANNOUNCEMENT";
      }
      if (channel.type === 10) {
        channeltype = "Text";
      }
      if (channel.type === 11) {
        channeltype = "Text";
      }
      if (channel.type === 12) {
        channeltype = "Text";
      }
      if (channel.type === 13) {
        channeltype = "Text";
      }
      if (channel.type === 14) {
        channeltype = "Text";
      }
      const embed = new EmbedBuilder()
        .setTitle(`Channel Information`)
        .setThumbnail(
          interaction.guild.iconURL({
            format: "png",
            dynamic: true,
            size: 1024,
          })
        )
        .setFooter({ text: "©2022 - 2023 | Reliable" })
        .addFields(
          {
            name: "ChannelInfo:",
            value: `**\`•\` Name**: ${channel}
**\`•\` Description**: ${channel.topic || "None"}
**\`•\` ID**: ${channel.id}
**\`•\` Category**: ${channel.parentId ? `${channel.parent.name}` : "None"}
**\`•\` Total Webhooks**: ${webhookArray || "None"}
**\`•\` Created**: <t:${parseInt(channel.createdTimestamp / 1000)}:R>`,
            inline: false,
          },
          {
            name: "VC",
            value: `
**\`•\` Members**: ${memberArray || "None"}
**\`•\` Max Members**: ${channel.userLimit || "None"}
**\`•\` Bitrate**: ${channel.bitrate || "None"}
          ㅤ
          `,
          }
        )
        .setColor(CustomHex("#2F3136"));
      const components = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("YES")
          .setLabel(`Position: ${channel.position}`)
          .setStyle("Secondary")
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("NO")
          .setLabel(`Type: ${channeltype}`)
          .setStyle("Secondary")
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("idk")
          .setLabel(`NSFW: ${channel.nsfw ? "Yes" : "No"}`)
          .setStyle("Secondary")
          .setDisabled(true)
      );

      interaction.reply({ embeds: [embed], components: [components] });
    } else if (interaction.options.getSubcommand() === "covid-countries") {
      let countries = interaction.options.getString("country") || "";
      axios.get(`https://disease.sh/v2/countries/${countries}`)
        .then((response) => response.data)
        .then((data) => {
          const embed = new EmbedBuilder()
            .setTitle(`Coronavirus | Countries Stats`)
            .setDescription(
              `>>> Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus. Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus.
Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment. However, some will become seriously ill and require medical attention.
The virus can spread from an infected person’s mouth or nose in small liquid particles when they cough, sneeze, speak, sing or breathe. These particles range from larger respiratory droplets to smaller aerosols. It is important to practice respiratory etiquette, for example by coughing into a flexed elbow, and to stay home and self-isolate until you recover if you feel unwell.`
            )
            .setColor(CustomHex("#2F3136"))
            .setTimestamp()
            .setImage(
              "https://www.fda.gov/files/how-you-can-make-a-difference-1600x900.png"
            )
            .setFooter({ text: "©2022 - 2023 | Reliable" })
            .setThumbnail(data?.countryInfo.flag)
            .addFields(
              {
                name: "`🍁` | Country Infomation",
                value: `**\`•\` Country Name**: **\`${data.country}\`**
**\`•\` Lat & Lon**: **\`${data?.countryInfo.lat} & ${
                  data?.countryInfo.long
                }\`**
**\`•\` Population**: **\`${data?.population.toString()}\`**
**\`•\` Continent**: **\`${data?.continent.toString()}\`**`,
                inline: false,
              },
              {
                name: "`😷` | Cases Total",
                value: `**\`•\` Cases Total**: **\`${data?.cases.toString()}\`**
**\`•\` Cases Today**: **\`${data?.todayCases.toString()}\`**
**\`•\` Deaths Total**: **\`${data?.deaths.toString()}\`**
**\`•\` Deaths Today**: **\`${data?.todayDeaths.toString()}\`**
**\`•\` Recovered**: **\`${data?.recovered.toString()}\`**
**\`•\` Active**: **\`${data?.active.toString()}\`**
**\`•\` Critical**: **\`${data?.critical.toString()}\`**
**\`•\` Cases per 1 million**: **\`${data?.casesPerOneMillion.toString()}\`**
**\`•\` Deaths per 1 million**: **\`${data?.deathsPerOneMillion.toString()}\`**
**\`•\` Recovered per 1 million**: **\`${data?.recoveredPerOneMillion.toString()}\`**
                `,
                inline: false,
              }
            );
          interaction.reply({ embeds: [embed] });
        })
        .catch((e) => {
          console.log(e);
          const err_embed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription(
              "<:reliable_wrong:1043155193077960764> | Invaild Country"
            )
            .setColor(CustomHex("#2F3136"))
            .setTimestamp()
            .setFooter({ text: "©2022 - 2023 | Reliable" });

          interaction.reply({ embeds: [err_embed], ephemeral: true });
        });
    } else if (interaction.options.getSubcommand() === "covid-world-wide") {
      axios.get(`https://covid19.mathdro.id/api`)
        .then((response) => response.data)
        .then((data) => {
          let confirmed = data.confirmed.value.toLocaleString();
          let recovered = data.recovered.value.toLocaleString();
          let deaths = data.deaths.value.toLocaleString();

          const embed = new EmbedBuilder()
            .setTitle(`Coronavirus | Worldwide Stats`)
            .setDescription(
              `>>> Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus. Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus.
Most people who fall sick with COVID-19 will experience mild to moderate symptoms and recover without special treatment. However, some will become seriously ill and require medical attention.
The virus can spread from an infected person’s mouth or nose in small liquid particles when they cough, sneeze, speak, sing or breathe. These particles range from larger respiratory droplets to smaller aerosols. It is important to practice respiratory etiquette, for example by coughing into a flexed elbow, and to stay home and self-isolate until you recover if you feel unwell.`
            )
            .setColor(CustomHex("#2F3136"))
            .setTimestamp()
            .setImage(
              "https://www.fda.gov/files/how-you-can-make-a-difference-1600x900.png"
            )
            .setFooter({ text: "©2022 - 2023 | Reliable" })
            .addFields(
              {
                name: "Location",
                value: `> **\`WorldWide\`**`,
                inline: true,
              },

              {
                name: "Total Confirmed Cases",
                value: `> **\`${confirmed}\`**`,
                inline: true,
              },
              {
                name: "Total Deaths",
                value: `> **\`${deaths}\`**`,
                inline: true,
              }
            );
          interaction.reply({ embeds: [embed] });
        });
    } else if (interaction.options.getSubcommand() === "member-count") {
      const members = interaction.guild.members.cache;
      const dndusers = members.filter(
        (member) => !member.user.bot && member.presence?.status === "dnd"
      ).size;
      const onlineusers2 = members.filter(
        (member) => !member.user.bot && member.presence?.status === "online"
      ).size;
      const onlineusers3 = members.filter(
        (member) => !member.user.bot && member.presence?.status === "idle"
      ).size;
      const dndbots = members.filter(
        (member) => member.user.bot && member.presence?.status === "dnd"
      ).size;
      const onlinebots2 = members.filter(
        (member) => member.user.bot && member.presence?.status === "online"
      ).size;
      const onlinebots3 = members.filter(
        (member) => member.user.bot && member.presence?.status === "idle"
      ).size;
      const usersonlineAll = dndusers + onlineusers2 + onlineusers3;
      const botssonlineAll = dndbots + onlinebots2 + onlinebots3;

      const embed = new EmbedBuilder()
        .setColor(CustomHex("#2F3136"))
        .setFooter({ text: "©2022 - 2023 | Reliable" })
        .setTitle(`Membercount`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .addFields(
          {
            name: `:couple: Total Members (${interaction.guild.memberCount})`,
            value: `**\`•\` Members: \`${
              members.filter((member) => !member.user.bot).size
            }\`**
**\`•\` Bots: \`${members.filter((member) => member.user.bot).size}\`**`,
            inline: false,
          },
          {
            name: `<:reliable_verifedbot:1030802332298006598> Total Online Members (\`${usersonlineAll}\` / \`${
              members.filter((member) => !member.user.bot).size
            }\`)`,
            value: `**<:reliable_dnd:1044914867779412078> Users with DND: \`${dndusers}\`**
**<:reliable_online:1040907077763207259> Users with Online: \`${onlineusers2}\`**
**<:reliable_idle:1044914924519960606> Users with Idle: \`${onlineusers3}\`**`,
            inline: false,
          },
          {
            name: `<:reliable_maintainance:1040906925233143878> Total Online Bots (\`${botssonlineAll}\` / \`${
              members.filter((member) => member.user.bot).size
            }\`)`,
            value: `**<:reliable_dnd:1044914867779412078> Bots with DND: \`${dndbots}\`**
**<:reliable_online:1040907077763207259> Bots with Online: \`${onlinebots2}\`**
**<:reliable_idle:1044914924519960606> Bots with Idle: \`${onlinebots3}\`**`,
            inline: false,
          }
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "npm") {
      const target = interaction.options.getString("name") || "";
       axios.get(`https://registry.npmjs.com/${target}`)
        .then((res) => res.data)
        .then((json) => {
          const embed = new EmbedBuilder()

            .setColor(CustomHex("#2F3136"))
            .setTitle("NPM Searched")
            .setImage(
              "https://www.bleepstatic.com/content/posts/2018/07/12/npm.png"
            )
            .setDescription(
              `> **\`${json.description}\`**` || "**`No description`**`"
            )
            .addFields(
              {
                name: "Package Name",
                value: `> **\`${json.name}\`**`,
                inline: false,
              },
              {
                name: "Author",
                value: `> **\`${
                  json.author ? json.author.name : "Unknown"
                }\`**`,
                inline: false,
              },
              {
                name: "Version",
                value: `> **\`${json["dist-tags"].latest}\`**`,
                inline: false,
              },
              {
                name: "License",
                value: `> **\`${json.license || "None"}\`**`,
                inline: true,
              },
              {
                name: "Creation Date",
                value: `**\`${moment
                  .utc(json.time.created)
                  .format("YYYY/MM/DD hh:mm:ss")}\`**`,
                inline: true,
              },
              {
                name: "Modification Date",
                value: `> **\`${
                  json.time.modified
                    ? moment
                        .utc(json.time.modified)
                        .format("YYYY/MM/DD hh:mm:ss")
                    : "None"
                }\`**`,
                inline: true,
              },
              {
                name: "Maintainers",
                value: `> **\`${json.maintainers
                  .map((user) => user.name)
                  .join(", ")}\`**`,
                inline: true,
              }
            );

          interaction.reply({ embeds: [embed] });
        });
    } else if (interaction.options.getSubcommand() === "pokemon") {
      const poke2 = interaction.options.getString("name") || "";

       axios.get(
        `https://some-random-api.ml/pokemon/pokedex?pokemon=${poke2}`
      )
        .then((res) => res.data)
        .then((json) => {
          const embed = new EmbedBuilder()
            .setTitle(`${json.name}`)
            .setThumbnail(`http://i.some-random-api.ml/pokemon/${poke2}.gif`)
            .setDescription(`> ${json.description}`)
            .addFields(
              {
                name: "ID",
                value: `> **\`${json.id}\`**`,
              },
              {
                name: "Type",
                value: `> **\`${json.type}\`**`,
              },
              {
                name: "Species",
                value: `> **\`${json.species}\`**`,
              },
              {
                name: "Abilities",
                value: `> **\`${json.abilities}\`**`,
              },
              {
                name: "Height",
                value: `> **\`${json.height}\`**`,
              },
              {
                name: "Weight",
                value: `> **\`${json.weight}\`**`,
              },
              {
                name: "Base Experience",
                value: `> **\`${json.base_experience}\`**`,
              },
              {
                name: "Gender",
                value: `> **\`${json.gender}\`**`,
              },
              {
                name: "Egg Groups",
                value: `> **\`${json.egg_groups}\`**`,
              },

              {
                name: "Generation",
                value: `> **\`${json.generation}\`**`,
                inline: true,
              }
            )
            .setColor("#2F3136")
            .setFooter({ text: "©2022 - 2023 | Reliable" });

          return interaction.reply({ embeds: [embed] });
        });
    } else if (interaction.options.getSubcommand() === "reddit") {
      const subreddit = interaction.options.getString("subreddit") || "";
      const embed = new EmbedBuilder().setColor(CustomRGB(255, 0, 0));
      const reactions = ["😂", "🤨"];

      try {
        const response = await axios.get(
          `https://meme-api.herokuapp.com/gimme/${encodeURIComponent(
            subreddit
          )}`
        );

        if (response?.data?.nsfw && !interaction.channel.nsfw) {
          embed
            .setTitle("🔞 NSFW content")
            .setDescription(
              "No **Age-Restricted** content allowed in this channel. Go to a channel where **NSFW** is *enabled*."
            );
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        embed
          .setColor("#2F3136")
          .setTitle("Reddit Searched")
          .setFooter({ text: "©2022 - 2023 | Reliable" })
          .addFields(
            {
              name: `‣ Reddit Title`,
              value: `> **\`${response.data.title}\`**`,
              inline: false,
            },
            {
              name: `‣ Reddit URL`,
              value: `> **[Click here](${response.data.postLink})**`,
              inline: false,
            },
            {
              name: `‣ Reddit Rating`,
              value: `> **\`${response.data.ups}\`**`,
              inline: false,
            },
            {
              name: `‣ Reddit By`,
              value: `> **[${response.data.author}](https://reddit.com/user/${response.data.author})**`,
              inline: false,
            }
          )
          .setImage(response.data.url);

        const reply = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });
        reactions.forEach((reaction) => reply.react(reaction).catch(() => {}));
      } catch (error) {
        embed
          .setTitle("🔍 Unable to reach API")
          .setDescription(`A connection to the API could not be established.`);

        if (error.response?.data?.message)
          embed
            .setTitle("🔍 Unable to find content or subreddit")
            .setDescription(error.response.data.message);

        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === "role") {
      const role = interaction.options.getRole("role");
      const displayed = role.hoist === true ? "Yes" : "No";
      const mentionable = role.mentionable === true ? "Yes" : "No";
      const createdts = new Date(role.createdTimestamp + 6 * 3600000);
      const createdtime = createdts.toLocaleString();

      const embed = new EmbedBuilder()
        .setColor("#2F3136")
        .setFooter({ text: "©2022 - 2023 | Reliable" })
        .addFields({
          name: "Role Information:",
          value: `**\`•\` Role Name**: <@&${role.id}>
**\`•\` User in Role**: **\`${role.members.size}\` Users**    
**\`•\` Displayed Seperately**: **\`${displayed}\`**  
**\`•\` Role Creation Date**: ${createdtime}  
**\`•\` Mentionable**: **\`${mentionable}\`**
**\`•\` Role Color**: **\`${role.hexColor}\`**`,
        });
      await interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "role-perm") {
      const role = interaction.options.getRole("target");
      const rolePermissions = role.permissions
        .toArray()
        .map((p) => `\`${p}\``)
        .join(", ");
      const embed = new EmbedBuilder()
        .setTitle(`Role Permissions`)
        .addFields(
          {
            name: "**`•`** Role Name",
            value: `> <@&${role.id}> (${role.id})`,
            inline: true,
          },
          {
            name: "**`•`** Role Permissions",
            value: `${rolePermissions || "None"}`,
            inline: false,
          }
        )
        .setTimestamp()
        .setColor("#2F3136")
        .setFooter({ text: "©2022 - 2023 | Reliable" });
      interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (interaction.options.getSubcommand() === "server") {
      const { guild } = interaction;
      const { members, channels, emojis, roles, stickers } = guild;

      const sortedRoles = roles.cache
        .map((role) => role)
        .slice(1, roles.cache.size)
        .sort((a, b) => b.position - a.position);
      const userRoles = sortedRoles.filter((role) => !role.managed);
      const managedRoles = sortedRoles.filter((role) => role.managed);
      const botCount = members.cache.filter((member) => member.user.bot).size;

      const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
        let totalLength = 0;
        const result = [];

        for (const role of roles) {
          const roleString = `<@&${role.id}>`;

          if (roleString.length + totalLength > maxFieldLength) break;

          totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
          result.push(roleString);
        }

        return result.length;
      };

      const splitPascal = (string, separator) =>
        string.split(/(?=[A-Z])/).join(separator);
      const toPascalCase = (string, separator = false) => {
        const pascal =
          string.charAt(0).toUpperCase() +
          string
            .slice(1)
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
        return separator ? splitPascal(pascal, separator) : pascal;
      };

      const getChannelTypeSize = (type) =>
        channels.cache.filter((channel) => type.includes(channel.type)).size;

      const totalChannels = getChannelTypeSize([
        ChannelType.GuildText,
        ChannelType.GuildNews,
        ChannelType.GuildVoice,
        ChannelType.GuildStageVoice,
        ChannelType.GuildForum,
        ChannelType.GuildPublicThread,
        ChannelType.GuildPrivateThread,
        ChannelType.GuildNewsThread,
        ChannelType.GuildCategory,
      ]);

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#2F3136")
            .setTitle(`${guild.name}'s Information`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .setFooter({ text: "©2022 - 2023 | Reliable" })
            .setImage(guild.bannerURL({ size: 1024 }))
            .addFields(
              {
                name: "**`🌐`** | General",
                value: [
                  `**\`•\`** **Created On** <t:${parseInt(
                    guild.createdTimestamp / 1000
                  )}:R>`,
                  `**\`•\`** **Server ID** **\`${guild.id}\`**`,
                  `**\`•\`** **Owner** <@${guild.ownerId}> (**\`${guild.ownerId}\`**)`,
                  `**\`•\`** **Language** **\`${new Intl.DisplayNames(["en"], {
                    type: "language",
                  }).of(guild.preferredLocale)}\`**`,
                  `**\`•\`** **Vanity URL** ${
                    guild.vanityURLCode || "**`None`**"
                  }`,
                ].join("\n"),
              },
              {
                name: "**`📝`** | Description",
                value: `> ${guild.description || "**`None`**"}`,
              },
              {
                name: "<a:reliable_info:1030410449579147314> | Features",
                value:
                  guild.features
                    ?.map(
                      (feature) =>
                        `<:reliable_right:1042843202429919272> ${toPascalCase(
                          feature,
                          " "
                        )}`
                    )
                    ?.join("\n") || "**`None`**",
                inline: true,
              },
              {
                name: "<:reliable_moderation:1030443113958875236> | Security",
                value: [
                  `**\`👀\`** **Explicit Filter**  **\`${splitPascal(
                    GuildExplicitContentFilter[guild.explicitContentFilter],
                    " "
                  )}\`**`,
                  `**\`🔞\`** **NSFW Level** **\`${splitPascal(
                    GuildNSFWLevel[guild.nsfwLevel],
                    " "
                  )}\`**`,
                  `**\`🔒\`** **Verification Level** **\`${splitPascal(
                    GuildVerificationLevel[guild.verificationLevel],
                    " "
                  )}\`**`,
                ].join("\n"),
                inline: true,
              },
              {
                name: `<a:reliable_members:1030037727485362197> | Users (**\`${guild.memberCount}\`**)`,
                value: [
                  `**\`👨‍👩‍👧‍👦\`** **Members** **\`${
                    guild.memberCount - botCount
                  }\`**`,
                  `**\`🤖\`** **Bots** **\`${botCount}\`**`,
                ].join("\n"),
                inline: true,
              },
              {
                name: `<:reliable_earlysupporter:1030801808400056421> | Roles (**\`${maxDisplayRoles(
                  userRoles
                )}\` of \`${userRoles.length}\`**)`,
                value: `${
                  userRoles.slice(0, maxDisplayRoles(userRoles)).join(" ") ||
                  "**`None`**"
                }`,
              },
              {
                name: `**\`👷‍♂️\`** | Managed Roles (**\`${maxDisplayRoles(
                  managedRoles
                )}\` of \`${managedRoles.length}\`**)`,
                value: `${
                  managedRoles
                    .slice(0, maxDisplayRoles(managedRoles))
                    .join(" ") || "**`None`**"
                }`,
              },
              {
                name: `**\`🍃\`** | Channels, Threads & Categories (**\`${totalChannels}\`**)`,
                value: [
                  `**\`•\`** **Text** **\`${getChannelTypeSize([
                    ChannelType.GuildText,
                    ChannelType.GuildForum,
                    ChannelType.GuildNews,
                  ])}\`**`,
                  `**\`•\`** **Voice** **\`${getChannelTypeSize([
                    ChannelType.GuildVoice,
                    ChannelType.GuildStageVoice,
                  ])}\`**`,
                  `**\`•\`** **Threads** **\`${getChannelTypeSize([
                    ChannelType.GuildPublicThread,
                    ChannelType.GuildPrivateThread,
                    ChannelType.GuildNewsThread,
                  ])}\`**`,
                  `**\`•\`** **Categories** **\`${getChannelTypeSize([
                    ChannelType.GuildCategory,
                  ])}\`**`,
                ].join("\n"),
                inline: true,
              },
              {
                name: `**\`🍂\` | **Emojis & Stickers (**\`${
                  emojis.cache.size + stickers.cache.size
                }\`**)`,
                value: [
                  `**\`•\`** **Animated** **\`${
                    emojis.cache.filter((emoji) => emoji.animated).size
                  }\`**`,
                  `**\`•\`** **Static** **\`${
                    emojis.cache.filter((emoji) => !emoji.animated).size
                  }\`**`,
                  `**\`•\`** **Stickers** **\`${stickers.cache.size}\`**`,
                ].join("\n"),
                inline: true,
              },
              {
                name: "**`🍁` | ** Boosting",
                value: [
                  `**\`•\`** **Tier** **\`${
                    guild.premiumTier || "**None**"
                  }\`**`,
                  `**\`•\`** **Boosts** **\`${
                    guild.premiumSubscriptionCount || "**None**"
                  }\`**`,
                  `**\`•\`** **Boosters** **\`${
                    guild.members.cache.filter(
                      (member) => member.roles.premiumSubscriberRole
                    ).size || "**None**"
                  }\`**`,
                  `**\`•\`** **Total Boosters** **\`${
                    guild.members.cache.filter((member) => member.premiumSince)
                      .size
                  }\`**`,
                ].join("\n"),
                inline: true,
              },
              {
                name: "`🧧` | Banner",
                value: guild.bannerURL() ? "** **" : "**`None`**",
              }
            ),
        ],
        ephemeral: false,
      });
    } else if (interaction.options.getSubcommand() === "user") {
      const target =
        interaction.options.getMember("target") || interaction.member;
      const { user, presence, roles } = target;
      const formatter = new Intl.ListFormat("en-GB", {
        style: "narrow",
        type: "conjunction",
      });

      await user.fetch();

      const statusType = {
        idle: "1FJj7pX.png",
        dnd: "fbLqSYv.png",
        online: "JhW7v9d.png",
        invisible: "dibKqth.png",
      };

      const activityType = [
        "🕹 Playing",
        "🎙 Streaming",
        "🎧 Listening to",
        "📺 Watching",
        "🤹🏻‍♀️ Custom",
        "🏆 Competing in",
      ];

      const clientType = [
        { name: "desktop", text: "Computer", emoji: "💻" },
        { name: "mobile", text: "Phone", emoji: "📱" },
        { name: "web", text: "Website", emoji: "🔌" },
        { name: "offline", text: "Offline", emoji: "💤" },
      ];

      const flags = {
        BugHunterLevel1:
          "<:reliable_bughunter:1030800879680507954 [**`Bug Hunter Level 1`**]",
        BugHunterLevel2:
          "<:reliable_bughunter2:1030800967207243836 [**`Bug Hunter Level 2`**]",
        CertifiedModerator:
          "<:reliable_moderation:1030443113958875236> [**`Certified Moderator`**]",
        HypeSquadOnlineHouse1:
          "<:reliable_hypersquadbravery:1030801385706500150> [**`HyperSquad Bravery`**]",
        HypeSquadOnlineHouse2:
          "<:reliable_hypesquadbrilliance:1030800522787176448> [**`HyperSquad Brilliance`**]",
        HypeSquadOnlineHouse3:
          "<:reliable_hypersquadbalance:1030801362126114910> [**`HyperSquad Balance`**]",
        Hypesquad:
          "<:reliable_hypesquadbrilliance:1030800522787176448>  [**`HyperSquad Brilliance`**]",
        Partner:
          "<:reliable_discordparthner:1030801628741247066> [**`Discord Parthner`**]",
        PremiumEarlySupporter:
          "<:reliable_earlysupporter:1030801808400056421>  [**`Early Supporter`**]",
        Staff:
          "<:reliable_DiscordStaff:1030802121945260042> [**`Discord Staff`**]",
        VerifiedBot:
          "<:reliable_verifedbot:1030802332298006598> [**`Verified Bot`**]",
        ActiveDeveloper:
          "<:reliable_activedeveloper:1040628618344288286> [**`Active Developer`**]",
        VerifiedDeveloper:
          "<a:reliable_developer:1030802329139675156> [**`Verified Developer`**]",
        NITRO: "<:reliable_nitro:1053162461529911396> [**`Nitro`**]",
        BOOSTER_1:
          "<:reliable_boost1:1053162540965826592> [**`Booster Level 1`**]",
        BOOSTER_2:
          "<:reliable_boost2:1053163733347745823> [**`Booster Level 2`**]",
        BOOSTER_3:
          "<:reliable_boost3:1053163885907157074> [**`Booster Level 3`**]",
        BOOSTER_4:
          "<:reliable_boost4:1053164843202515036> [**`Booster Level 4`**]",
        BOOSTER_5:
          "<:reliable_boost5:1053163087865331744> [**`Booster Level 5`**]",
        BOOSTER_6:
          "<:reliable_boost6:1053162620292694077> [**`Booster Level 6`**]",
        BOOSTER_7:
          "<:reliable_boost7:1053162572527972462> [**`Booster Level 7`**]",
        BOOSTER_8:
          "<:reliable_boost8:1053162854687182858> [**`Booster Level 8`**]",
        BOOSTER_9:
          "<:reliable_boost9:1053162671056363531> [**`Booster Level 9`**]",
      };

      const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
        let totalLength = 0;
        const result = [];

        for (const role of roles) {
          const roleString = `<@&${role.id}>`;

          if (roleString.length + totalLength > maxFieldLength) break;

          totalLength += roleString.length + 1; // +1 as it's likely we want to display them with a space between each role, which counts towards the limit.
          result.push(roleString);
        }

        return result.length;
      };
      const response = await fetch(
        `https://japi.rest/discord/v1/user/${target.id}`
      );
      const data = await response.json();

      const sortedRoles = roles.cache
        .map((role) => role)
        .sort((a, b) => b.position - a.position)
        .slice(0, roles.cache.size - 1);

      const clientStatus =
        presence?.clientStatus instanceof Object
          ? Object.keys(presence.clientStatus)
          : "offline";
      const userFlags = user.flags.toArray();

      const badges = data.data.public_flags_array
        ? data.data.public_flags_array.map((flag) => flags[flag]).join(" ")
        : "No Badges.";
      const badges2 = userFlags.length
        ? formatter.format(userFlags.map((flag) => `**${flags[flag]}**`))
        : "**`None`**";

      const deviceFilter = clientType.filter((device) =>
        clientStatus.includes(device.name)
      );
      const devices = !Array.isArray(deviceFilter)
        ? new Array(deviceFilter)
        : deviceFilter;

      const embed = new EmbedBuilder()

        .setColor("#2F3136")
        .setFooter({ text: "©2022 - 2023 | Reliable" })
        .setAuthor({
          name: user.tag,
          iconURL: `https://i.imgur.com/${
            statusType[presence?.status || "invisible"]
          }`,
        })
        .setImage(user.bannerURL({ size: 1024 }))

        .addFields(
          { name: "`🆔` | ID", value: `**\`${user.id}\`**` },
          {
            name: " `⭐` | Activities",
            value:
              presence?.activities
                .map(
                  (activity) =>
                    `\` ${activityType[activity.type]} ${activity.name} \` `
                )
                .join("\n") || "**`None`**",
          },
          {
            name: " `📆` | Account Created",
            value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: "`🤝🏻` | Joined Server",
            value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: " `🦸🏻‍♀️` | Nickname",
            value: `**${user.nickname || "**`None`**"}**`,
            inline: true,
          },
          {
            name: `\`🍂\` | Roles (${maxDisplayRoles(sortedRoles)} of ${
              sortedRoles.length
            })`,
            value: `${
              sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(" ") ||
              "**`None`**"
            }`,
          },
          {
            name: `\`🎋\` | Badges`,
            value: `${badges} ${badges2}`,
          },
          {
            name: `\`🎀\` | Devices`,
            value: devices
              .map((device) => `**\`${device.emoji} ${device.text}\`**`)
              .join("\n"),
            inline: true,
          },
          {
            name: " `🖤` | Boosting Server",
            value: `${
              roles.premiumSubscriberRole
                ? `**\`Since\`** <t:${parseInt(
                    target.premiumSinceTimestamp / 1000
                  )}:R>`
                : "**`No`**"
            }`,
            inline: true,
          },
          {
            name: " `🎏` | Banner",
            value: user.bannerURL() ? "** **" : "**`None`**",
          }
        );

      const avatarbutton = new ButtonBuilder()
        .setLabel(`Avatar Link`)
        .setEmoji("<:reliable_earlysupporter:1030801808400056421>")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `${
            user.avatarURL({ size: 1024, dynamic: true, format: "png" }) ||
            "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/75bff394-4f86-45a8-a923-e26223aa74cb/de901o7-d61b3bfb-f1b1-453b-8268-9200130bbc65.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzc1YmZmMzk0LTRmODYtNDVhOC1hOTIzLWUyNjIyM2FhNzRjYlwvZGU5MDFvNy1kNjFiM2JmYi1mMWIxLTQ1M2ItODI2OC05MjAwMTMwYmJjNjUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.aEck9OnRf_XJzrEzZNvrGS2XpAlo2ixuxoAX5fgpNnw"
          }`
        );

      await interaction.reply({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(avatarbutton)],
        ephemeral: false,
      });
    } else if (interaction.options.getSubcommand() === "user-perm") {
      const member =
        interaction.options.getMember("target") || interaction.member;
      const memberPermissions = member.permissions
        .toArray()
        .map((p) => `\`${p}\``)
        .join(", ");

      const embed = new EmbedBuilder()
        .setTitle(`User Permissions`)
        .addFields(
          {
            name: "**`•`** User Name",
            value: `> <@${member.id}> (${member.id})`,
            inline: true,
          },
          {
            name: "**`•`** User Permissions",
            value: `${memberPermissions}`,
            inline: false,
          }
        )
        .setTimestamp()
        .setColor("#2F3136")
        .setFooter({ text: "©2022 - 2023 | Reliable" });
      interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (interaction.options.getSubcommand() === "iss-location") {
      fetch("http://api.open-notify.org/iss-now.json")
        .then((res) => res.json())
        .then((out) => {
          var iss_info = out;
          var position = iss_info["iss_position"];
          var latitude = position["latitude"];
          var longitude = position["longitude"];

          const Embed = new EmbedBuilder()
            .setTitle("International Space Station Location")
            .setColor("#2F3136")
            .addFields(
              {
                name: "**`•`** Latitude",
                value: `> **\`${latitude}\`**`,
                inline: true,
              },
              {
                name: "**`•`** Longitude",
                value: `> **\`${longitude}\`**`,
                inline: true,
              }
            )
            .setImage(
              `http://c.files.bbci.co.uk/8C58/production/_115182953_issspaceindexsml.jpg`
            )
            .setFooter({ text: "©2022 - 2023 | Reliable" })
            .setTimestamp();
          interaction.reply({ embeds: [Embed] });
        });
    } else if (interaction.options.getSubcommand() === "apod") {
      fetch(
        "https://api.nasa.gov/planetary/apod?api_key=l2eGLkw7K710Z3JKP9abb0v0VGfRC03rJgo3frvo"
      )
        .then((res) => res.json())
        .then((json) => {
          const Embed = new EmbedBuilder()
            .setTitle(`${json.title}`)
            .setColor("#2F3136")
            .setDescription(`>>> **${json.explanation}**`)
            .addFields(
              {
                name: "**`•`** Last Updated",
                value: `> **\`${json.date}\`**`,
                inline: true,
              },
              {
                name: "**`•`** Copyright",
                value: `> **\`${json.copyright}\`**`,
                inline: true,
              }
            )
            .setImage(`${json.hdurl}`)
            .setFooter({ text: "©2022 - 2023 | Reliable" });
          interaction.reply({ embeds: [Embed] });
        });
    } else if (interaction.options.getSubcommand() === "quotes") {
      fetch("https://api.popcat.xyz/quote")
        .then((res) => res.json())
        .then((json) => {
          const Embed = new EmbedBuilder()
            .setTitle(`Quotes`)
            .setColor("#2F3136")
            .setDescription(`>>> **${json.quote}**`)
            .setFooter({ text: "©2022 - 2023 | Reliable" });
          interaction.reply({ embeds: [Embed] });
        });
    } else if (interaction.options.getSubcommand() === "translate") {
      const query = interaction.options.getString("query");
      const raw = query;
      const from = interaction.options.getString("from");
      const to = interaction.options.getString("to");
      try {
        const translated = await translate(query, {
          from: `${from}`,
          to: `${to}`,
        });
        const Embed = new EmbedBuilder()
          .setTitle("Translation")
          .addFields(
            {
              name: "**`•` From**",
              value: `> **\`${from}\`**`,
              inline: true,
            },
            {
              name: "**`•` To**",
              value: `> **\`${to}\`**`,
              inline: true,
            },
            { name: "**`•` Raw**", value: "```" + raw + "```" },
            {
              name: "**`•` Translated**",
              value: "```" + translated.text + "```",
            }
          )
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });

        return await interaction.reply({ embeds: [Embed] });
      } catch (err) {
        const err_embed = new EmbedBuilder()
          .setTitle("Error")
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | Please send a valid** [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) **destination language code.**"
          )
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });

        interaction.reply({ embeds: [err_embed], ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === "twitter") {
      const user = interaction.options.getString("account");

      try {
        const body = await twitter.users(user);
        let verifiedtweet = "No";
        if (body.verified === true) {
          verifiedtweet = "Yes";
        }
        const tweet = new EmbedBuilder()
          .setTitle("Twitter Account")
          .addFields({
            name: "Twitter Information Listed",
            value: `**\`•\` Account ID**: **\`${body.id}\`**
**\`•\` Followers**: **\`${body.followers_count.toLocaleString()}\`**
**\`•\` Tweets**: **\`${body.statuses_count.toLocaleString()}\`**
**\`•\` Following**: **\`${body.friends_count.toLocaleString()}\`**
**\`•\` Account Verified**: **<a:reliable_verified:1041749335735537704> \`${
              verifiedtweet || "No"
            }\`**
**\`•\` Account Creation Date**: **\`${moment
              .utc(body.created_at)
              .format("dddd, MMMM, Do YYYY")}\`**
**\`•\` Account Description**: \`\`\`${body.description || "None"}\`\`\``,
          })
          .setThumbnail(body.profile_image_url_https.replace("_normal", ""))
          .setImage(body.profile_banner_url)
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });
        interaction.reply({ embeds: [tweet] });
      } catch (e) {
        console.log(e);

        if (e.status === 403) {
          const err_embed = new EmbedBuilder()
            .setTitle(`Error`)
            .setDescription(
              "**<:reliable_wrong:1043155193077960764> | This user is in private mode, or deleted account!**"
            )
            .setTimestamp()
            .setColor("#2F3136")
            .setFooter({ text: "©2022 - 2023 | Reliable" });

          interaction.reply({ embeds: [err_embed], ephemeral: true });
        }

        if (e.status === 404) {
          const err_embed2 = new EmbedBuilder()
            .setTitle(`Error`)
            .setDescription(
              `**<:reliable_wrong:1043155193077960764> | Unknown error: \`${e.message}\`**`
            )
            .setTimestamp()
            .setColor("#2F3136")
            .setFooter({ text: "©2022 - 2023 | Reliable" });

          interaction.reply({ embeds: [err_embed2], ephemeral: true });
        }
      }
    } else if (interaction.options.getSubcommand() === "movie") {
      const imob = new imdb.Client({ apiKey: "5e36f0db" });
      let movie = await imob.get({
        name: interaction.options.getString("name"),
      });

      try {
        const Embed = new EmbedBuilder()
          .setTitle(`${movie.title}`)
          .setImage(movie.poster)
          .setDescription(`> **${movie.plot}**`)
          .addFields({
            name: "Movie Info",
            value: `**\`•\` Country**: **\`${movie.country || "N/A"}\`**
**\`•\` Languages**: **\`${movie.languages || "N/A"}\`**
**\`•\` Type**: **\`${movie.type || "N/A"}\`**
**\`•\` Parental Rating**: **\`${movie.rated || "N/A"}\`**
**\`•\` Overall Rating**: **\`${movie.rating || "N/A"}\`**
**\`•\` Release Date**: **\`${movie.released || "N/A"}\`**
**\`•\` Runtime**: **\`${movie.runtime || "N/A"}\`**
**\`•\` Director**: **\`${movie.director || "N/A"}\`**
**\`•\` Writers**: **\`${movie.writers || "N/A"}\`**
**\`•\` Actors**: **\`${movie.actors || "N/A"}\`**
**\`•\` Year**: **\`${movie.year || "N/A"}\`**`,
          })
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });

        interaction.reply({ embeds: [Embed] });
      } catch (err) {
        console.log(err);

        const err_embed = new EmbedBuilder()
          .setTitle("Error")
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | Please send a valid movie name!**"
          )
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });

        interaction.reply({ embeds: [err_embed], ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === "season") {
      const country = interaction.options.getString("country");
      try {
        fetch(
          `https://seasonapi.iamsohom829.repl.co/api/get-current-season/?api_key=da768dcebb706dd028da555a79308766ece0ef364641115ed6f1be9b96cf406c&country=${country}`
        )
          .then((res) => res.json())
          .then((json) => {
            const Embed = new EmbedBuilder()
              .setTitle(`Season`)
              .setDescription(`> **${json.season}**\n > **${json.year}**`)
              .setTimestamp()
              .setColor("#2F3136")
              .setFooter({ text: "©2022 - 2023 | Reliable" });

            interaction.reply({ embeds: [Embed] });
          });
      } catch (err) {
        console.log(err);

        const err_embed = new EmbedBuilder()
          .setTitle("Error")
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | Please send a valid movie name!**"
          )
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });

        interaction.reply({ embeds: [err_embed], ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === "weather") {
      try {
        const place = interaction.options.getString("place");

        axios.get(
          `https://luminabot.xyz/api/json/weather?location=${place}&degreetype=C`
        )
          .then((res) => res.data)
          .then((json) => {
            const Embed = new EmbedBuilder()
              .setTitle(`Weather Information`)
              .setThumbnail(`https:${json.current.condition?.icon}`)
              .addFields(
                {
                  name: "`🏞️` | Location Info",
                  value: `**\`•\` Location Name**: **\`${
                    json.location?.name || "N/A"
                  }\`**
**\`•\` Region**: **\`${json.location?.region || "N/A"}\`**
**\`•\` Country**: **\`${json.location?.country || "N/A"}\`**
**\`•\` Lat & Lon**: **\`${json.location?.lat || "N/A"} & ${
                    json.location?.lon || "N/A"
                  }\`**
**\`•\` Time Zone Identifier**: **\`${json.location?.tz_id || "N/A"}\`**
**\`•\` Local Time**: **\`${json.location?.localtime || "N/A"}\`**`,
                },
                {
                  name: "`🌥️` | Weather Condition Info",
                  value: `**\`•\` Condition**: **\`${
                    json.current.condition?.text || "N/A"
                  }\`**
**\`•\` Feels Like**: **\`${json.current.feelslike_c || "N/A"}°C & ${
                    json.current.feelslike_f || "N/A"
                  }°F\`**
**\`•\` Humidity**: **\`${json.current.humidity || "N/A"}%\`**
**\`•\` Last Updated**: **<t:${json.current?.last_updated_epoch || "N/A"}:F>**`,
                },
                {
                  name: "`☁️` | Wind Info",
                  value: `**\`•\` Wind Speed**: **\`${
                    json.current?.wind_mph || "N/A"
                  }mi/h & ${json.current?.wind_kph || "N/A"}km/h\`**
**\`•\` Wind Direction**: **\`${json.current.wind_dir || "N/A"}\`**
**\`•\` Wind Degree**: **\`${json.current.wind_degree || "N/A"}\`**
**\`•\` Pressure**: **\`${json.current?.pressure_mb || "N/A"}MB & ${
                    json.current?.pressure_in || "N/A"
                  }IN\`**
**\`•\` Precip**: **\`${json.current?.precip_mm || "N/A"}MM & ${
                    json.current?.precip_in || "N/A"
                  }IN\`**
**\`•\` Visibility**: **\`${json.current?.vis_miles || "N/A"}mi & ${
                    json.current?.vis_km || "N/A"
                  }km\`**
**\`•\` Gust**: **\`${json.current?.gust_mph || "N/A"}mi/h & ${
                    json.current?.gust_kph || "N/A"
                  }km/h\`**
**\`•\` UV**: **\`${json.current?.uv || "N/A"}\`**`,
                },
                {
                  name: "`💨` | Air Quality",
                  value: `**\`•\` Co**: **\`${
                    json.current.air_quality?.co || "N/A"
                  }\`**
**\`•\` O3**: **\`${json.current.air_quality?.o3 || "N/A"}\`**
**\`•\` No2**: **\`${json.current.air_quality?.no2 || "N/A"}\`**
**\`•\` So2**: **\`${json.current.air_quality?.so2 || "N/A"}\`**
**\`•\` PM2.5**: **\`${json.current.air_quality?.pm2_5 || "N/A"}\`**
**\`•\` PM10**: **\`${json.current.air_quality?.pm10 || "N/A"}\`**`,
                }
              )

              .setTimestamp()
              .setColor("#2F3136")
              .setFooter({ text: "©2022 - 2023 | Reliable" });

            interaction.reply({ embeds: [Embed] });
          });
      } catch (err) {
        console.log(err);
        const err_embed = new EmbedBuilder()
          .setTitle("Error")
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | Something went wrong**"
          )
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });

        interaction.reply({ embeds: [err_embed], ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === "country") {
      try {
        const country = interaction.options.getString("name");

        fetch(`https://restcountries.com/v3.1/name/${country}`)
          .then((res) => res.json())
          .then((json) => {
            const data = json[0];

            let independent = "No";
            if (data.independent === true) {
              independent = "Yes";
            }
            let unMember = "No";
            if (data.unMember === true) {
              unMember = "Yes";
            }

            const Embed = new EmbedBuilder()
              .setTitle(`Country Information`)
              .setImage(data.flags.png)
              .addFields(
                {
                  name: "`🏞️` | General Info",
                  value: `**\`•\` Common Name**: **\`${
                    data.name?.common || "N/A"
                  }\`**
**\`•\` Official Name**: **\`${data.name?.official || "N/A"}\`**
**\`•\` Independent**: **\`${independent || "N/A"}\`**
**\`•\` Status**: **\`${data.status || "N/A"}\`**
**\`•\` United Nations Member**: **\`${unMember || "N/A"}\`**
**\`•\` Top-level domain**: **\`${data.tld[0] || "N/A"}\`**
**\`•\` Population**: **\`${data.population || "N/A"}\`**
**\`•\` Capital City**: **\`${data.capital[0] || "N/A"}\`**
**\`•\` Capital Lat & Lon**: **\`${data.capitalInfo?.latlng || "N/A"}\`**`,
                },
                {
                  name: "`🌐` | External Info",
                  value: `**\`•\` FIFA**: **\`${data.fifa || "N/A"}\`**
**\`•\` Borders**: **\`${data.borders || "N/A"}\`**
**\`•\` TimeZones**: **\`${data.timezones[0] || "N/A"}\`**
**\`•\` Continents**: **\`${data.continents[0] || "N/A"}\`**
**\`•\` Start of Week**: **\`${data.startOfWeek || "N/A"}\`**`,
                }
              )

              .setTimestamp()
              .setColor("#2F3136")
              .setFooter({ text: "©2022 - 2023 | Reliable" });

            const googlemap = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel(`Map Link`)
                .setEmoji("<:reliable_googlemaps:1046358219691405353>")
                .setStyle(ButtonStyle.Link)
                .setURL(`${data.maps.googleMaps}`)
            );

            interaction.reply({ embeds: [Embed], components: [googlemap] });
          });
      } catch (err) {
        console.log(err);
        const err_embed = new EmbedBuilder()
          .setTitle("Error")
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | Something went wrong**"
          )
          .setTimestamp()
          .setColor("#2F3136")
          .setFooter({ text: "©2022 - 2023 | Reliable" });

        interaction.reply({ embeds: [err_embed], ephemeral: true });
      }
    } else {
      interaction.reply({ content: `No sub command choosed` });
    }
  },
};
/**
 * @Author Reliable Inc.
 * @Copyright ©2022 - 2023 | Reliable Inc, All rights reserved.
 * @CodedBy Mohtasim Alam Sohom, Sajidur Rahman Tahsin
 */
