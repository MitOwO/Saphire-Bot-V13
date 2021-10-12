const { e } = require('../emojis.json')
const db = require('quick.db')
const client = require('../../index')

function xp(message) {
    if (message.author.bot)
        return

    if (db.get(`${message.author.id}.Timeout.Xp`))
        db.delete(`${message.author.id}.Timeout.Xp`)

    if (db.get(`TimeoutXP.${message.author.id}`))
        return

    const XpAdd = Math.floor(Math.random() * 3) + 1
    db.add(`Xp_${message.author.id}`, XpAdd)
    db.set(`TimeoutXP.${message.author.id}`, true)
    let level = db.get(`level_${message.author.id}`) || 1
    let xp = db.get(`Xp_${message.author.id}`) + 1
    let xpNeeded = level * 550;
    if (xpNeeded < xp) {
        db.subtract(`Xp_${message.author.id}`, level * 550)
        let newLevel = db.add(`level_${message.author.id}`, 1)
        let XpChannel = db.get(`Servers.${message.guild.id}.XPChannel`)
        let canal = client.channels.cache.get(XpChannel)
        if (canal) {
            canal.send(`${e.Tada} | ${message.author} alcançou o level ${newLevel} ${e.RedStar}`)
        }
    }
    setTimeout(() => { db.delete(`TimeoutXP.${message.author.id}`) }, 3000)
}

module.exports = xp