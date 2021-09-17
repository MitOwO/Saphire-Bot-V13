const { e } = require('../emojis.json')
const { Permissions } = require('discord.js')

function React(message) { // APLICAR TIMEOUT
    if (message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) {
        if (message.content.toLowerCase().includes('@everyone')) { message.react(e.PingEveryone).catch(err => { return }) }
        if (message.content.toLowerCase().includes('@here')) { message.react(e.PingEveryone).catch(err => { return }) }
        if (message.content.toLowerCase().includes('pikachu') && !message.author.bot) { message.react(e.Pikachu).catch(err => { return }) }
        if (message.content.toLowerCase().includes('nezuko') && !message.author.bot) { message.react(e.NezukoDance).catch(err => { return }) }
        if (message.content.toLowerCase().includes('itachi') && !message.author.bot) { message.react(e.Itachi).catch(err => { return }) }
        if (message.content.toLowerCase().includes('asuna') && !message.author.bot) { message.react(e.Asuna).catch(err => { return }) }
        if (message.content.toLowerCase().includes('deidara') && !message.author.bot) { message.react(e.Deidara).catch(err => { return }) }
        if (message.content.toLowerCase().includes('boom') && !message.author.bot) { message.react(e.Deidara).catch(err => { return }) }
        if (message.content.toLowerCase().includes('kirito') && !message.author.bot) { message.react(e.Kirito).catch(err => { return }) }
        if (message.content.toLowerCase().includes('loli') && !message.author.bot) { message.react("🚓").catch(err => { return }) }
    }
}

module.exports = React