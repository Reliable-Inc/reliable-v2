const {
    EmbedBuilder,
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    Embed
  } = require("discord.js");
  const { colors } = require("discordjs-colors-bundle");
  
  module.exports = {
    developer: false,
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Responses with bot ping")
      .setNSFW(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
      const sentTimeStamp = Date.now();
      const pinging = new EmbedBuilder()
      .setTitle("Ping - Checking")
      .setDescription(`<:reliable_maintainance:1040906925233143878> | **\`Checking the ping...\`**`)
      .setColor("#2F3136")
      .setFooter({ text: "©2022 - 2023 | Reliable" })
      .setTimestamp();

      await interaction.deferReply({ embeds: [pinging], ephemeral: true });
      const pingmsg = [
        "The bot is faster than a cheetah on caffeine!",
        "The bot's ping is lower than a limbo stick at a midget convention!",
        "The bot's ping is so fast, it's probably faster than your internet speed!",
        "The bot's ping is so low, it could probably run a marathon in under 2 hours!",
        "The bot's ping is so fast, it's probably the secret ingredient in Red Bull!",
        "The bot's ping is so low, it could probably win a race against Usain Bolt!",
        "The bot's ping is so fast, it probably leaves a sonic boom every time it sends a message!",
        "The bot's ping is so low, it could probably break the sound barrier without even trying!",
        "The bot's ping is so fast, it could probably dodge bullets like Neo in The Matrix!",
        "The bot's ping is so low, it could probably send a message to the moon and back before you finish reading this!",
      ];
      const pingmsgs = pingmsg[Math.floor(Math.random() * pingmsg.length)];

      const msgPing = Date.now() - sentTimeStamp;
      const PongEmbed = new EmbedBuilder()
        .setTitle("Ping - Checked")
        .setDescription(`*❝${pingmsgs}🙷*`)
        .setColor("#2F3136")
        .setFooter({ text: "©2022 - 2023 | Reliable" })
        .setTimestamp();

        const components = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("YES")
              .setLabel(`Websocket Ping: ${client.ws.ping}`)
              .setStyle("Secondary")
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId("NO")
              .setLabel(`Client Ping: ${msgPing}`)
              .setStyle("Secondary")
              .setDisabled(true)
        )
      await interaction.editReply({ embeds: [PongEmbed], components: [components], ephemeral: true });
    },
  };
  