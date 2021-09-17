const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { config } = require('../config.json');
require("dotenv").config()

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Pong'),
	new SlashCommandBuilder().setName('balance').setDescription('Confira o banco secretamente')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_CLIENT_BOT_TOKEN);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			// Routes.applicationCommands(config.clientId), // Global Commands
			{ body: commands },
		);

		console.log('Slash Commands | OK!');
	} catch (error) {
		console.error(error);
	}
})();