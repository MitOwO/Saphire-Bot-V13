const { Collection, Client, MessageEmbed } = require('discord.js')
const fs = require('fs');
const { e } = require('./Routes/emojis.json')
const { config } = require('./Routes/config.json')
require("dotenv").config()
const client = new Client({ intents: 32767, disableMentions: { parse: ['everyone'], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] } })
module.exports = client
client.commands = new Collection()
client.aliases = new Collection()
client.categories = fs.readdirSync("./src/commands/")

process.on('unhandledRejection', err => {
    if (err.code === 10008) return // Unknown Message
    if (err.code === 50001) return // Missing Acess
    if (err.code === 50013) return // Missing Permissions
    const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro | unhandledRejection`).setDescription(`\`\`\`js\n${err.stack.slice(0, 2000)}\`\`\``)
    client.users.cache.get(`${config.ownerId}`).send({ embeds: [NewError] }).catch(err => { })
});

["command", "event"].forEach(structure => { require(`./src/structures/${structure}`)(client); })
client.login(process.env.DISCORD_CLIENT_BOT_TOKEN)