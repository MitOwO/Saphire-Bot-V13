const db = require('quick.db')
const { e } = require('../emojis.json')
const { Permissions } = require('discord.js')

function AfkSystem(message) {

    if (db.get(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`)) {
        db.delete(`Servers.${message.guild.id}.AfkSystem.${message.author.id}`)
        if (message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) {
            message.react(`${e.Planet}`).catch(err => { })
        } else {
            message.reply(`${e.Check} O modo AFK foi desativado.`).then(msg => setTimeout(() => { msg.delete().catch(err => { }) }, 3000))
        }
    }

    if (db.get(`Client.AfkSystem.${message.author.id}`)) {
        db.delete(`Client.AfkSystem.${message.author.id}`)
        if (message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) {
            message.react(`${e.Planet}`).catch(err => { })
        } else {
            message.reply(`${e.Check} O modo AFK Global foi desativado.`).then(msg => setTimeout(() => { msg.delete().catch(err => { }) }, 3000))
        }
    }

    let UserAfk = message.mentions.members.first() || message.mentions.members.repliedUser
    if (UserAfk) {
        let RecadoGlobal = db.get(`Client.AfkSystem.${UserAfk.id}`)
        let RecadoServidor = db.get(`Servers.${message.guild.id}.AfkSystem.${UserAfk.id}`)
        if (db.get(`Client.AfkSystem.${UserAfk.id}`)) { message.reply(`${e.Planet} | ${UserAfk.user.username} está offline. --> ✍️ | ${RecadoGlobal}`) }
        if (db.get(`Servers.${message.guild.id}.AfkSystem.${UserAfk.id}`)) { message.reply(`${e.Afk} | ${UserAfk.user.username} está offline. --> ✍️ | ${RecadoServidor}`) }
    }
}

module.exports = AfkSystem