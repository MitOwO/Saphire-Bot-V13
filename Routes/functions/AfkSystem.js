const { sdb, ServerDb } = require('./database')
const { e } = require('../../database/emojis.json')
const { Message, Permissions } = require('discord.js')

/**
 * @param { Message } message 
 */

function AfkSystem(message) {

    if (!message.guild.me.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY))
        return

    const GuildId = message.guild.id

    if (ServerDb.get(`Servers.${GuildId}.AfkSystem.${message.author.id}`)) {
        ServerDb.delete(`Servers.${GuildId}.AfkSystem.${message.author.id}`)
        return message.react(`${e.Check}`).catch(() => { return message.channel.send(`${e.Check} | ${message.author}, o modo AFK Local foi desativado.`).catch(() => { }) })
    }

    if (sdb.get(`Users.${message.author.id}.AfkSystem`)) {
        sdb.delete(`Users.${message.author.id}.AfkSystem`)
        return message.react(`${e.Planet}`).catch(() => { return message.channel.send(`${e.Check} | ${message.author}, o modo AFK Global foi desativado.`).catch(() => { }) })
    }

    let user = message.mentions.users.first() || message.mentions.repliedUser
    if (user) {
        if (sdb.has(`Users.${user.id}.AfkSystem`)) return message.channel.send(`${e.Afk} | ${message.author}, ${user.username} está offline. --> ✍️ | ${sdb.get(`Users.${user.id}.AfkSystem`)}`)
        if (ServerDb.has(`Servers.${GuildId}.AfkSystem.${user.id}`)) return message.channel.send(`${e.Afk} | ${message.author}, ${user.username} está offline. --> ✍️ | ${ServerDb.get(`Servers.${GuildId}.AfkSystem.${user.id}`)}`)
    }
    
    return
}

module.exports = AfkSystem