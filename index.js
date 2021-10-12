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

process.on('unhandledRejection', (reason) => {
    if (reason.code === 500)
        return client.users.cache.get(`${config.ownerId}`)?.send({ content: 'unhandledRejection - GOT! Error.code 500!!!' }).catch(() => { })

    if (reason.code === 50035) return // Invalid Form Body
    if (reason.code === 10008) return // Unknown Message
    if (reason.code === 50001) return // Missing Acess
    if (reason.code === 50013) return // Missing Permissions
    const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro | unhandledRejection`).setDescription(`\`\`\`js\n${reason.stack.slice(0, 2000)}\`\`\``)
    client.users.cache.get(`${config.ownerId}`)?.send({ embeds: [NewError] }).catch(() => { })
});

process.on('uncaughtExceptionMonitor', async (error, origin) => {
    if (error.code === 10008) return // Unknown Message
    if (error.code === 50001) return // Missing Acess
    if (error.code === 50013) return // Missing Permissions
    const NewError = new MessageEmbed().setColor('RED').setTitle(`${e.Loud} Report de Erro | uncaughtExceptionMonitor`).setDescription(`\`\`\`js\n${error.stack.slice(0, 2000)}\`\`\``)
    const NewError2 = new MessageEmbed().setColor('RED').setDescription(`\`\`\`js\n${origin}\`\`\``)
    client.users.cache.get(`${config.ownerId}`)?.send({ embeds: [NewError, NewError2] }).catch(() => { })
});

["command", "event"].forEach(structure => { require(`./src/structures/${structure}`)(client); })
client.login(process.env.DISCORD_CLIENT_BOT_TOKEN)