const { Client, Events } = require("discord.js");
const { colors } = require("discordjs-colors-bundle");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MongoURL = process.env["MongoDB"];

const clientId = process.env["ClientId"];
const guildId = "1029777893112418314";
module.exports = {
  name: Events.ClientReady,
  once: true,

  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log(`${client.user.username} is online and ready.`);
    mongoose
      .connect(MongoURL)
      .then(() => {
        console.log("MongoDB Connected.");
      })
      .catch((e) => {
        console.error(e);
      });

    const commands = client.commands.map(({ data }) => data.toJSON());

    const rest = new REST({ version: "10" }).setToken(process.env["Token"]);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  },
};
