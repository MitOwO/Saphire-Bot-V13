const { e } = require('../emojis.json')
const { Permissions } = require('discord.js')
const db = require('quick.db')

async function React(message) {

    if (!message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS))
        return

    if (db.get('Client.React') !== null && 40000 - (Date.now() - db.get('Client.React')) > 0)
        return

    db.set('Client.React', Date.now())
    NewReactInteraction()

    function NewReactInteraction() {
        if (message.content?.toLowerCase().includes('@everyone')) { message.react(e.PingEveryone).catch(() => { }) }
        if (message.content?.toLowerCase().includes('@here')) { message.react(e.PingEveryone).catch(() => { }) }
        if (message.content?.toLowerCase().includes('nezuko') && !message.author.bot) { message.react(e.NezukoDance).catch(() => { }) }
        if (message.content?.toLowerCase().includes('itachi') && !message.author.bot) { message.react(e.Itachi).catch(() => { }) }
        if (message.content?.toLowerCase().includes('asuna') && !message.author.bot) { message.react(e.Asuna).catch(() => { }) }
        if (message.content?.toLowerCase().includes('deidara') && !message.author.bot) { message.react(e.Deidara).catch(() => { }) }
        if (message.content?.toLowerCase().includes('boom') && !message.author.bot) { message.react(e.Deidara).catch(() => { }) }
        if (message.content?.toLowerCase().includes('kirito') && !message.author.bot) { message.react(e.Kirito).catch(() => { }) }
        if (message.content?.toLowerCase().includes('loli') && !message.author.bot) { message.react("🚓").catch(() => { }) }
    }
}

module.exports = React