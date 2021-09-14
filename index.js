const { Collection, Client, } = require('discord.js')
const fs = require('fs');
require("dotenv").config()
const client = new Client({ intents: 32767, disableMentions: { parse: ['everyone'] } });
module.exports = client
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./src/commands/");
["command", "event"].forEach(handler => { require(`./src/handlers/${handler}`)(client); })
client.login(process.env.DISCORD_CLIENT_BOT_TOKEN)