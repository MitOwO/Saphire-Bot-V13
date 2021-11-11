const { sdb, ServerDb } = require('./database')
const { e } = require('../../database/emojis.json')
const { Message } = require('discord.js')

/**
 * @param { Message } message 
 */

function AfkSystem(message) {

    const GuildId = message.guild.id

    if (ServerDb.get(`Servers.${GuildId}.AfkSystem.${message.author.id}`)) {
        ServerDb.delete(`Servers.${GuildId}.AfkSystem.${message.author.id}`)
        return message.react(`${e.Check}`).catch(() => { return message.reply(`${e.Check} | O modo AFK Local foi desativado.`).catch(() => { }) })
    }

    if (sdb.get(`Users.${message.author.id}.AfkSystem`)) {
        sdb.delete(`Users.${message.author.id}.AfkSystem`)
        return message.react(`${e.Planet}`).catch(() => { return message.reply(`${e.Check} O modo AFK Global foi desativado.`).catch(() => { }) })
    }

    let user = message.mentions.users.first() || message.mentions.repliedUser
    if (user) {
        if (sdb.has(`Users.${user.id}.AfkSystem`)) return message.reply(`${e.Afk} | ${user.username} está offline. --> ✍️ | ${sdb.get(`Users.${user.id}.AfkSystem`)}`)
        if (ServerDb.has(`Servers.${GuildId}.AfkSystem.${user.id}`)) return message.reply(`${e.Afk} | ${user.username} está offline. --> ✍️ | ${ServerDb.get(`Servers.${GuildId}.AfkSystem.${user.id}`)}`)
    } else { return }
}

module.exports = AfkSystem