const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require('discord.js');
const { colors } = require('discordjs-colors-bundle');

module.exports = {
  developer: true,
  data: new ContextMenuCommandBuilder()
    .setName('user info')
    .setType(ApplicationCommandType.User),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const target =
      interaction.guild.members.cache.get(interaction.targetId) ??
      interaction.member;

    const { user, presence, roles } = target;
    const formatter = new Intl.ListFormat('en-GB', {
      style: 'narrow',
      type: 'conjunction',
    });

    await user.fetch();

    const statusType = {
      idle: '1FJj7pX.png',
      dnd: 'fbLqSYv.png',
      online: 'JhW7v9d.png',
      invisible: 'dibKqth.png',
    };

    const activityType = [
      '🕹 Playing',
      '🎙 Streaming',
      '🎧 Listening to',
      '📺 Watching',
      '🤹🏻‍♀️ Custom',
      '🏆 Competing in',
    ];

    const clientType = [
      { name: 'desktop', text: 'Computer', emoji: '💻' },
      { name: 'mobile', text: 'Phone', emoji: '📱' },
      { name: 'web', text: 'Website', emoji: '🔌' },
      { name: 'offline', text: 'Offline', emoji: '💤' },
    ];

    const flags = {
      BugHunterLevel1:
        '<:reliable_bughunter:1030800879680507954 [**`Bug Hunter Level 1`**]',
      BugHunterLevel2:
        '<:reliable_bughunter2:1030800967207243836 [**`Bug Hunter Level 2`**]',
      CertifiedModerator:
        '<:reliable_moderation:1030443113958875236> [**`Certified Moderator`**]',
      HypeSquadOnlineHouse1:
        '<:reliable_hypersquadbravery:1030801385706500150> [**`HyperSquad Bravery`**]',
      HypeSquadOnlineHouse2:
        '<:reliable_hypesquadbrilliance:1030800522787176448> [**`HyperSquad Brilliance`**]',
      HypeSquadOnlineHouse3:
        '<:reliable_hypersquadbalance:1030801362126114910> [**`HyperSquad Balance`**]',
      Hypesquad:
        '<:reliable_hypesquadbrilliance:1030800522787176448>  [**`HyperSquad Brilliance`**]',
      Partner:
        '<:reliable_discordparthner:1030801628741247066> [**`Discord Parthner`**]',
      PremiumEarlySupporter:
        '<:reliable_earlysupporter:1030801808400056421>  [**`Early Supporter`**]',
      Staff:
        '<:reliable_DiscordStaff:1030802121945260042> [**`Discord Staff`**]',
      VerifiedBot:
        '<:reliable_verifedbot:1030802332298006598> [**`Verified Bot`**]',
      ActiveDeveloper:
        '<:reliable_activedeveloper:1040628618344288286> [**`Active Developer`**]',
      VerifiedDeveloper:
        '<a:reliable_developer:1030802329139675156> [**`Verified Developer`**]',
      NITRO: '<:reliable_nitro:1053162461529911396> [**`Nitro`**]',
      BOOSTER_1:
        '<:reliable_boost1:1053162540965826592> [**`Booster Level 1`**]',
      BOOSTER_2:
        '<:reliable_boost2:1053163733347745823> [**`Booster Level 2`**]',
      BOOSTER_3:
        '<:reliable_boost3:1053163885907157074> [**`Booster Level 3`**]',
      BOOSTER_4:
        '<:reliable_boost4:1053164843202515036> [**`Booster Level 4`**]',
      BOOSTER_5:
        '<:reliable_boost5:1053163087865331744> [**`Booster Level 5`**]',
      BOOSTER_6:
        '<:reliable_boost6:1053162620292694077> [**`Booster Level 6`**]',
      BOOSTER_7:
        '<:reliable_boost7:1053162572527972462> [**`Booster Level 7`**]',
      BOOSTER_8:
        '<:reliable_boost8:1053162854687182858> [**`Booster Level 8`**]',
      BOOSTER_9:
        '<:reliable_boost9:1053162671056363531> [**`Booster Level 9`**]',
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
      .map(role => role)
      .sort((a, b) => b.position - a.position)
      .slice(0, roles.cache.size - 1);

    const clientStatus =
      presence?.clientStatus instanceof Object
        ? Object.keys(presence.clientStatus)
        : 'offline';
    const userFlags = user.flags.toArray();

    const badges = data.data.public_flags_array
      ? data.data.public_flags_array.map(flag => flags[flag]).join(' ')
      : 'No Badges.';
    const badges2 = userFlags.length
      ? formatter.format(userFlags.map(flag => `**${flags[flag]}**`))
      : '**`None`**';

    const deviceFilter = clientType.filter(device =>
      clientStatus.includes(device.name)
    );
    const devices = !Array.isArray(deviceFilter)
      ? new Array(deviceFilter)
      : deviceFilter;

    const embed = new EmbedBuilder()

      .setColor('#2F3136')
      .setFooter({ text: '©2022 - 2023 | Reliable' })
      .setAuthor({
        name: user.tag,
        iconURL: `https://i.imgur.com/${
          statusType[presence?.status || 'invisible']
        }`,
      })
      .setImage(user.bannerURL({ size: 1024 }))

      .addFields(
        { name: '`🆔` | ID', value: `**\`${user.id}\`**` },
        {
          name: ' `⭐` | Activities',
          value:
            presence?.activities
              .map(
                activity =>
                  `\` ${activityType[activity.type]} ${activity.name} \` `
              )
              .join('\n') || '**`None`**',
        },
        {
          name: ' `📆` | Account Created',
          value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: '`🤝🏻` | Joined Server',
          value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: ' `🦸🏻‍♀️` | Nickname',
          value: `**${user.nickname || '**`None`**'}**`,
          inline: true,
        },
        {
          name: `\`🍂\` | Roles (${maxDisplayRoles(sortedRoles)} of ${
            sortedRoles.length
          })`,
          value: `${
            sortedRoles.slice(0, maxDisplayRoles(sortedRoles)).join(' ') ||
            '**`None`**'
          }`,
        },
        {
          name: `\`🎋\` | Badges`,
          value: `${badges} ${badges2}`,
        },
        {
          name: `\`🎀\` | Devices`,
          value: devices
            .map(device => `**\`${device.emoji} ${device.text}\`**`)
            .join('\n'),
          inline: true,
        },
        {
          name: ' `🖤` | Boosting Server',
          value: `${
            roles.premiumSubscriberRole
              ? `**\`Since\`** <t:${parseInt(
                  target.premiumSinceTimestamp / 1000
                )}:R>`
              : '**`No`**'
          }`,
          inline: true,
        },
        {
          name: ' `🎏` | Banner',
          value: user.bannerURL() ? '** **' : '**`None`**',
        }
      );

    const avatarbutton = new ButtonBuilder()
      .setLabel(`Avatar Link`)
      .setEmoji('<:reliable_earlysupporter:1030801808400056421>')
      .setStyle(ButtonStyle.Link)
      .setURL(
        `${
          user.avatarURL({ size: 1024, dynamic: true, format: 'png' }) ||
          'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/75bff394-4f86-45a8-a923-e26223aa74cb/de901o7-d61b3bfb-f1b1-453b-8268-9200130bbc65.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzc1YmZmMzk0LTRmODYtNDVhOC1hOTIzLWUyNjIyM2FhNzRjYlwvZGU5MDFvNy1kNjFiM2JmYi1mMWIxLTQ1M2ItODI2OC05MjAwMTMwYmJjNjUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.aEck9OnRf_XJzrEzZNvrGS2XpAlo2ixuxoAX5fgpNnw'
        }`
      );

    return interaction.editReply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(avatarbutton)],
      ephemeral: false,
    });
  },
};
