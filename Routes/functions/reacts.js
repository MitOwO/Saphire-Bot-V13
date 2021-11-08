const { e } = require('../../database/emojis.json')
const { sdb } = require('./database')

async function React(message) {

    if (message.author.bot)
        return

    if (sdb.get('Client.Timeouts.React') !== null && 120000 - (Date.now() - sdb.get('Client.Timeouts.React')) > 0)
        return

    sdb.set('Client.Timeouts.React', Date.now())
    return NewReactInteraction()

    function NewReactInteraction() {
        if (message.content?.toLowerCase().includes('@everyone')) return message.react(e.PingEveryone).catch(() => { })
        if (message.content?.toLowerCase().includes('@here')) return message.react(e.PingEveryone).catch(() => { })
        if (message.content?.toLowerCase().includes('nezuko')) { return message.react(e.NezukoDance).catch(() => { }) }
        if (message.content?.toLowerCase().includes('itachi')) { return message.react(e.Itachi).catch(() => { }) }
        if (message.content?.toLowerCase().includes('asuna')) { return message.react(e.Asuna).catch(() => { }) }
        if (message.content?.toLowerCase().includes('deidara')) { return message.react(e.Deidara).catch(() => { }) }
        if (message.content?.toLowerCase().includes('boom')) { return message.react(e.Deidara).catch(() => { }) }
        if (message.content?.toLowerCase().includes('kirito')) { return message.react(e.Kirito).catch(() => { }) }
        if (message.content?.toLowerCase().includes('loli')) { return message.react("🚓").catch(() => { }) }
        return message.react(e.SaphireHi).catch(() => { sdb.delete('Client.Timeouts.React') })
    }
}

module.exports = React