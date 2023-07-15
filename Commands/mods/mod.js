const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Embed,
  Colors,
  ActionRowBuilder,
  AuditLogEvent,
  Events,
  GuildMemberManager,
  PermissionsBitField,
  PermissionFlagsBits,
} = require('discord.js');
const e = require('express');
const ms = require('ms');

module.exports = {
  beta: false,
  data: new SlashCommandBuilder()
    .setName('moderation')
    .setDescription('Moderation commands')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.BanMembers ||
        PermissionFlagsBits.Administrator ||
        PermissionFlagsBits.KickMembers ||
        PermissionFlagsBits.ManageMessages ||
        PermissionFlagsBits.ManageRoles ||
        PermissionFlagsBits.TimeoutMembers
    )
    .addSubcommand(sub =>
      sub
        .setName('ban')
        .setDescription('Ban a member from your guild.')
        .addUserOption(op =>
          op
            .setName('target')
            .setDescription('Select the user who you want to ban')
            .setRequired(true)
        )
        .addStringOption(op =>
          op
            .setName('reason')
            .setDescription('Provide a reason for ban')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('lock')
        .setDescription(
          'Lock the Channel for everyone, nobody can write messages anymore.'
        )
        .addChannelOption(op =>
          op
            .setName('channel')
            .setDescription('Mention the channel')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('unlock')
        .setDescription(
          'Unlock the Channel for everyone, everyone can write messages anymore.'
        )
        .addChannelOption(op =>
          op
            .setName('channel')
            .setDescription('Mention the channel')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('addrole')
        .setDescription('Adds role to a user')
        .addUserOption(op =>
          op.setName('user').setDescription('Select the user').setRequired(true)
        )
        .addRoleOption(op =>
          op.setName('role').setDescription('Select the role').setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('removerole')
        .setDescription('Removes role to a user')
        .addUserOption(op =>
          op.setName('user').setDescription('Select the user').setRequired(true)
        )
        .addRoleOption(op =>
          op.setName('role').setDescription('Select the role').setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('setnick')
        .setDescription('Sets nick to a user')
        .addUserOption(op =>
          op.setName('user').setDescription('Select the user').setRequired(true)
        )
        .addStringOption(op =>
          op
            .setName('nickname')
            .setDescription('Provide nickname')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('list-bans')
        .setDescription('List banned user of this server.')
    )
    .addSubcommand(sub =>
      sub
        .setName('kick')
        .setDescription('kick a member from this guild.')
        .addUserOption(op =>
          op
            .setName('target')
            .setDescription('Select a member who you want to kick')
            .setRequired(true)
        )
        .addStringOption(op =>
          op
            .setName('reason')
            .setDescription('Provide a reason for kick')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('clear')
        .setDescription('Clear a specified amount of message.')
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('Enter amount to clear message')
            .setRequired(true)
        )
        .addUserOption(op =>
          op
            .setName('target')
            .setDescription('Select a user who you wants to clear')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('timeout')
        .setDescription('timeout a member from this guild.')
        .addUserOption(op =>
          op
            .setName('target')
            .setDescription('Select a member who you want to timeout')
            .setRequired(true)
        )
        .addIntegerOption(op =>
          op
            .setName('time')
            .setDescription('set the time for timeout (in minutes)')
            .setRequired(true)
        )
        .addStringOption(op =>
          op
            .setName('reason')
            .setDescription('Provide a reason for timeout')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('role-member-info')
        .setDescription('Shows list of members having a role.')
        .addRoleOption(op =>
          op.setName('role').setDescription('Select a role').setRequired(true)
        )
    ),

  async execute(interaction, client) {
    if (interaction.options.getSubcommand() === 'ban') {
      const { channel, options } = interaction;

      const user = options.getUser('target') || "You can't ban yourself!";

      let reason = interaction.options.getString('reason');
      const member = await interaction.guild.members
        .fetch(user.id)
        .catch(console.error);

      if (!reason) reason = 'No reason provided';
      if (member.id === interaction.user.id) {
        const err_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot ban yourself!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err_embed], ephemeral: true });
      }

      if (member.id === interaction.client.user.id) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot ban me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (member.id === interaction.guild.ownerId) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot ban the owner!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }
      if (!member.bannable) {
        const err59_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | The mentioned user is not bannable!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err59_embed], ephemeral: true });
      }
      if (
        interaction.member.roles.highest.position <
        member.roles.highest.position
      ) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot ban a user who have higher role than you!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }
      if (client.user.roles.highest.position < member.roles.highest.position) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | I cannot ban user who have higher role than me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      member.ban({ deleteMessageDays: 1, reason: reason }).catch(console.error);

      const bannedEmbed = new EmbedBuilder()
        .setColor('#2F3136')
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setTitle(`Banned a member..`)
        .addFields(
          {
            name: '‣ Banned',
            value: `**\`${user.tag}\`**`,
            inline: true,
          },
          {
            name: '‣ Reason',
            value: `**\`${reason}\`**`,
            inline: true,
          }
        );

      interaction.channel.send({ embeds: [bannedEmbed] });

      await interaction.reply({
        content: `Done. Banned ${user.tag}`,
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === 'kick') {
      const { channel, options } = interaction;

      const user = options.getUser('target');
      let reason = interaction.options.getString('reason');
      const member = await interaction.guild.members
        .fetch(user.id)
        .catch(console.error);

      if (!reason) reason = 'No reason provided';
      if (member.id === interaction.user.id) {
        const err_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot kick yourself!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err_embed], ephemeral: true });
      }

      if (member.id === interaction.client.user.id) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | I cannot kick myself**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (!member.kickable) {
        const err59_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | The mentioned user is not kickable!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err59_embed], ephemeral: true });
      }

      if (!member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        const err3_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | You can't kick the member! You need `Kick Members` Permission**"
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err3_embed], ephemeral: true });
      }

      if (member.id === interaction.guild.ownerId) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot kick the owner!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (
        interaction.member.roles.highest.position <
        member.roles.highest.position
      ) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot kick a user who have higher role than you!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }
      if (client.user.roles.highest.position < member.roles.highest.position) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | I cannot kick a user who have higher role than me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      member.kick(reason).catch(console.error);

      const kickedEmbed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`Kicked a member..`)
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .addFields(
          {
            name: '‣ Kicked',
            value: `**\`${user.tag}\`**`,
            inline: true,
          },
          {
            name: '‣ Reason',
            value: `**\`${reason}\`**`,
            inline: true,
          }
        );

      interaction.channel.send({ embeds: [kickedEmbed] });
      await interaction.reply({
        content: `Done. Kicked ${user.tag}`,
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === 'clear') {
      const { channel, options } = interaction;

      const Amount = options.getInteger('amount');
      const Target = options.getUser('target');

      const Messages = await channel.messages.fetch();
      const Response = new EmbedBuilder().setColor('#2F3136');

      if (Target) {
        let i = 0;
        const filtered = [];
        (await Messages).filter(m => {
          if (m.author.id === Target.id && Amount > i) {
            filtered.push(m);
            i++;
          }
        });

        await channel.bulkDelete(filtered, true).then(messages => {
          Response.setDescription(
            `> **Cleared \`${messages.size}\`** **from ${Target}**.`
          );
          Response.setTitle(`Cleared Messages`);
          Response.setFooter({
            text: '©2022 - 2023 | Reliable',
            ephemeral: true,
          });
          interaction.reply({ embeds: [Response] });
        });
      } else {
        if (Amount > 100) {
          interaction.reply({
            content: `Amount must be less than or equal to 100`,
            ephemeral: true,
          });
        }
        await channel.bulkDelete(Amount, true).then(messages => {
          Response.setTitle('Cleared Messages');
          Response.setDescription(
            `> **Cleared \`${messages.size}\`** **from this channel.**`
          );
          Response.setFooter({ text: '©2022 - 2023 | Reliable' });
          interaction.reply({ embeds: [Response], ephemeral: true });
        });
      }
    } else if (interaction.options.getSubcommand() === 'timeout') {
      const { channel, options } = interaction;

      const user = options.getUser('target');
      let reason = interaction.options.getString('reason');
      let time = interaction.options.getInteger('time');
      const member = await interaction.guild.members
        .fetch(user.id)
        .catch(console.error);

      if (!reason) reason = 'No reason provided';
      if (member.id === interaction.user.id) {
        const error_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot timeout yourself!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [error_embed] });
      }

      if (member.id === interaction.client.user.id) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot timeout me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (member.id === interaction.guild.ownerId) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot timeout the owner!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (
        interaction.member.roles.highest.position <
        member.roles.highest.position
      ) {
        const error2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot timeout a user who have higher role than you!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [error2_embed], ephemeral: true });
      }

      if (client.user.roles.highest.position < member.roles.highest.position) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | I cannot timeout a user who have higher role than me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      member
        .timeout(time == null ? null : time * 60 * 1000, reason)
        .catch(console.error);

      const timoutEMBED = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`Timeout`)
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setTimestamp()
        .addFields(
          {
            name: '‣ Timeout to',
            value: `**\`${user.tag}\`**`,
            inline: true,
          },
          {
            name: '‣ Timeout By',
            value: `**\`${interaction.user.tag}\`**`,
            inline: true,
          },
          {
            name: '‣ Timeout Duration',
            value: `**\`${time}m\`**`,
            inline: true,
          },
          {
            name: '‣ Reason',
            value: `**\`${reason}\`**`,
            inline: true,
          }
        );

      interaction.reply({ embeds: [timoutEMBED], ephemeral: true });
    } else if (interaction.options.getSubcommand() === 'lock') {
      let channel =
        interaction.options.getChannel('channel') || interaction.channel;

      if (
        !channel
          .permissionsFor(interaction.guild.roles.everyone)
          .has('SendMessages')
      ) {
        const err_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | Channel is already locked!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' })
          .setTimestamp();
        interaction.reply({ embeds: [err_embed], ephemeral: true });
      }

      channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        SendMessages: false,
        AddReactions: false,
      });

      const lockedembed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`Channel Locked`)
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setTimestamp()
        .addFields({
          name: 'Locked Information',
          value: `**\`•\` Channel**: ${channel}
**\`•\` Moderator**: <@${interaction.user.id}>`,
          inline: false,
        });

      interaction.reply({ embeds: [lockedembed] });
    } else if (interaction.options.getSubcommand() === 'unlock') {
      let channel =
        interaction.options.getChannel('channel') || interaction.channel;

      channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        SendMessages: true,
        AddReactions: true,
      });

      const unlockedembed = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`Channel Unlocked`)
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setTimestamp()
        .addFields({
          name: 'Unlocked Information',
          value: `**\`•\` Channel**: ${channel}
**\`•\` Moderator**: <@${interaction.user.id}>`,
          inline: false,
        });

      interaction.reply({ embeds: [unlockedembed] });
    } else if (interaction.options.getSubcommand() === 'list-bans') {
      var amount = 1;
      const fetchBans = interaction.guild.bans.fetch();
      const bannedMembers = (await fetchBans)
        .map(
          member =>
            `**\`(#${amount++})\`** **\`${member.user.username}\`** | (*${
              member.user.id
            }*) [\`**${member.user.tag}**\`]`
        )
        .join('\n');

      const bannedlist = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`List of Banned Users`)
        .setFooter({ text: '©2022 - 2023 | Reliable' })
        .setTimestamp()
        .addFields({
          name: 'Total Banned People',
          value: `**\`${amount - 1}\`**`,
          inline: true,
        })
        .setDescription(`${bannedMembers}`);
      interaction.reply({ embeds: [bannedlist] });
    } else if (interaction.options.getSubcommand() === 'role-member-info') {
      const role = interaction.options.getRole('role');
      let membersWithRole = interaction.guild.members.cache
        .filter(member => {
          return member.roles.cache.find(r => r.name === role.name);
        })
        .map(member => {
          return member.user.username;
        });
      if (membersWithRole > 2048) {
        const err_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription('> **Sorry, the role member list is too big!**')
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });

        interaction.reply({ embeds: [err_embed], ephemeral: true });
      }

      const rolemember = new EmbedBuilder()
        .setColor('#2F3136')
        .setTitle(`Role Member Info`)
        .addFields(
          {
            name: 'Role Name',
            value: `**<@&${role.id}>** (\`${role.id}\`)`,
            inline: true,
          },
          {
            name: 'User(s) in it',
            value: `>>> ${membersWithRole.join('\n') || '**`N/A`**'}`,
            inline: false,
          }
        )
        .setFooter({ text: '©2022 - 2023 | Reliable' });

      interaction.reply({ embeds: [rolemember], ephemeral: true });
    } else if (interaction.options.getSubcommand() === 'addrole') {
      const role = interaction.options.getRole('role');
      const member = interaction.options.getMember('user');

      if (member.id === interaction.client.user.id) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | I can't add role to me!**"
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (member.id === interaction.guild.ownerId) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot add role the owner!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (
        interaction.member.roles.highest.position <
        member.roles.highest.position
      ) {
        const error2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot add role to a user who have higher role than you!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [error2_embed], ephemeral: true });
      }
      if (client.user.roles.highest.position < member.roles.highest.position) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | I cannot add role to a user who have higher role than me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (member.roles.cache.has(role.id)) {
        const err_embed4 = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | The mentioned user already has the role!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });

        interaction.reply({ embeds: [err_embed4], ephemeral: true });
      } else {
        member.roles.add(role);
        const embed = new EmbedBuilder()
          .setTitle('Role Added')
          .addFields(
            {
              name: 'Role added by',
              value: `<@${interaction.user.id}>`,
            },
            {
              name: 'Role added to',
              value: `<@${member.id}>`,
            },
            {
              name: 'Role Information',
              value: `**\`•\` Role Name**: <@&${role.id}>    
          **\`•\` Role Color**: **\`${role.hexColor}\`**`,
            }
          )
          .setColor('#2F3136')
          .setTimestamp()
          .setFooter({ text: '©2022 - 2023 | Reliable' });

        interaction.reply({ embeds: [embed] });
      }
    } else if (interaction.options.getSubcommand() === 'removerole') {
      const role = interaction.options.getRole('role');
      const member = interaction.options.getMember('user');
      const { guild } = interaction;

      if (member.id === interaction.client.user.id) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | I can't remove role from me!**"
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (member.id === interaction.guild.ownerId) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot remove role the owner!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (
        interaction.member.roles.highest.position <
        member.roles.highest.position
      ) {
        const error2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot remove role to a user who have higher role than you!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [error2_embed], ephemeral: true });
      }
      if (client.user.roles.highest.position < member.roles.highest.position) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | I cannot remove a role from a user who have higher role than me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }
      if (!member.roles.cache.has(role.id)) {
        const err_embed4 = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | The mentioned user doesn't have the role!**"
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });

        interaction.reply({ embeds: [err_embed4], ephemeral: true });
      } else {
        member.roles.remove(role);
        const embed = new EmbedBuilder()
          .setTitle('Role Removed')
          .addFields(
            {
              name: 'Role removed by',
              value: `<@${interaction.user.id}>`,
            },
            {
              name: 'Role removed from',
              value: `<@${member.id}>`,
            },
            {
              name: 'Role Information',
              value: `**\`•\` Role Name**: <@&${role.id}>    
      **\`•\` Role Color**: **\`${role.hexColor}\`**`,
            }
          )
          .setColor('#2F3136')
          .setTimestamp()
          .setFooter({ text: '©2022 - 2023 | Reliable' });

        interaction.reply({ embeds: [embed] });
      }
    } else if (interaction.options.getSubcommand() === 'setnick') {
      const nickname = interaction.options.getString('nickname');
      const member = interaction.options.getMember('user');

      if (member.id === interaction.client.user.id) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            "**<:reliable_wrong:1043155193077960764> | I can't set nick to me!**"
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (member.id === interaction.guild.ownerId) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot set nick to the owner!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }

      if (
        interaction.member.roles.highest.position <
        member.roles.highest.position
      ) {
        const error2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | You cannot set nick to a user who have higher role than you!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [error2_embed], ephemeral: true });
      }
      if (client.user.roles.highest.position < member.roles.highest.position) {
        const err2_embed = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | I cannot set nick to a user who have higher role than me!**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });
        return interaction.reply({ embeds: [err2_embed], ephemeral: true });
      }
      if (nickname.length > 32) {
        const err_embed4 = new EmbedBuilder()
          .setTitle('Error')
          .setDescription(
            '**<:reliable_wrong:1043155193077960764> | The provided nickname is big! try small ones.**'
          )
          .setColor('#2F3136')
          .setFooter({ text: '©2022 - 2023 | Reliable' });

        interaction.reply({ embeds: [err_embed4], ephemeral: true });
      } else {
        const oldNickname = member.nickname || 'None';
        await member.setNickname(nickname);

        const embed = new EmbedBuilder()
          .setTitle('Nickname Changed')
          .addFields(
            {
              name: 'Nick added by',
              value: `<@${interaction.user.id}>`,
            },
            {
              name: 'Nick added to',
              value: `<@${member.id}>`,
            },
            {
              name: 'Nick Information',
              value: `**\`•\` Old Nick**: **\`${oldNickname}\`**    
      **\`•\` New Nick**: **\`${nickname}\`**`,
            }
          )
          .setColor('#2F3136')
          .setTimestamp()
          .setFooter({ text: '©2022 - 2023 | Reliable' });

        interaction.reply({ embeds: [embed] });
      }
    } else {
      interaction.reply({ content: 'No sub command choosed' });
    }
  },
};
/**
 * @Author Reliable Inc.
 * @Copyright ©2022 - 2023 | Reliable Inc, All rights reserved.
 * @CodedBy Mohtasim Alam Sohom, Sajidur Rahman Tahsin
 */
