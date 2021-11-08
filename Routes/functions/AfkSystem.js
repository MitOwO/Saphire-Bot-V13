const { sdb } = require('./database')
const { e } = require('../../database/emojis.json')

function AfkSystem(message) {

    if (sdb.get(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`)) {
        sdb.delete(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`)
        message.react(`${e.Check}`).catch(() => { message.reply(`${e.Check} | O modo AFK Local foi desativado.`).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 3000)) })
    }

    if (sdb.get(`Users.${message.author.id}.AfkSystem`)) {
        sdb.delete(`Users.${message.author.id}.AfkSystem`)
        message.react(`${e.Planet}`).catch(() => { message.reply(`${e.Check} O modo AFK Global foi desativado.`).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 3000)) })
    }

    let user = message.mentions.members.first() || message.mentions.repliedUser
    if (user) {
        if (sdb.get(`Users.${user.id}.AfkSystem`)) { message.reply(`${e.Planet} | ${user.user.username} está offline. --> ✍️ | ${sdb.fetch(`Users.${user.id}.AfkSystem`)}`) }
        if (sdb.get(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`)) { message.reply(`${e.Afk} | ${user.user.username} está offline. --> ✍️ | ${sdb.fetch(`Users.${user.id}.AfkSystem.${message.guild.id}`)}`) }
    }
}

module.exports = AfkSystem