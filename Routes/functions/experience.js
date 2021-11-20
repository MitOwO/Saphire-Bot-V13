
const { Message } = require('discord.js')
const { e } = require('../../database/emojis.json')
const { sdb, db, ServerDb } = require('./database')
const Notify = require('./notify')

/**
 * @param { Message } message 
 */

async function xp(message) {
    if (message.author.bot)
        return

    if (db.get(`XpSystem.${message.author.id}`) !== null && 3000 - (Date.now() - db.get(`XpSystem.${message.author.id}`)) > 0)
        return

    const XpAdd = Math.floor(Math.random() * 3) + 1
    if (XpAdd <= 0) XpAdd++
    sdb.add(`Users.${message.author.id}.Xp`, XpAdd)
    db.set(`XpSystem.${message.author.id}`, Date.now())
    let level = db.get(`level_${message.author.id}`) || 1
    let xp = sdb.get(`Users.${message.author.id}.Xp`) + 1
    let xpNeeded = level * 550;
    if (xpNeeded < xp) {
        sdb.subtract(`Users.${message.author.id}.Xp`, level * 550)
        let newLevel = db.add(`level_${message.author.id}`, 1)
        let canal = await message.guild.channels.cache.get(ServerDb.get(`Servers.${message.guild.id}.XPChannel`))
        if (db.get(`XpSystem.${message.author.id}`) && !canal) {
            Notify(message.guild.id, 'Recurso Desabilitado', 'O canal de notificações de level up presente no meu banco de dados não foi encontrado neste servidor. O canal foi deletado do meu sistema.')
        }
        if (canal) {
            return canal.send(`${e.Tada} | ${message.author} alcançou o level ${newLevel} ${e.RedStar}`)
        } else { return }
    }
}

module.exports = xp