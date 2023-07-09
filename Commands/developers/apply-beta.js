const { ModalBuilder, SlashCommandBuilder, ActionRowBuilder, Client, ChatInputCommandInteraction, TextInputBuilder, TextInputStyle ,} = require("discord.js");
import * as cb from "discordjs-colors-bundle";

module.exports = {
  data: new SlashCommandBuilder()
  .setName("apply-beta")
  .setDescription(`Kindly submit your formal application for our exclusive beta program participation.`),
  
  /** 
  * @param {ChatInputCommandInteraction} interaction
  * @param {Client} client
  */
  
  async execute(interaction, client) {
    const modal = new ModalBuilder()
    .setCustomId("bm")
    .setTitle("Beta Application")
    
    const Username = new TextInputBuilder()
    .setCustomId("userName")
    .setLabel("May we know your Discord username, please?")
    .setPlaceholder("exiled.reaper_.x") 
    .setStyle(TextInputStyle.Short);

    const WhyJustWHYBRUH = new TextInputBuilder()
    .setCustomId("justWHY")
    .setLabel("Why join our beta? Explain.") 
    .setStyle(TextInputStyle.Paragraph);

    const UserNameActionRow = new ActionRowBuilder().addComponents(Username);
    const WhyActionRow = new ActionRowBuilder().addComponents(WhyJustWHYBRUH);

    modal.addComponents(UserNameActionRow, WhyActionRow);

    await interaction.showModal(modal);
  }
}

/**
 * @ Author Reliable Inc.
 * @ Copyright ©2022 - 2023 | Reliable Inc, All rights reserved.
 * @ Coded By Mohtasim Alam Sohom, Sajidur Rahman Tahsin
 */
